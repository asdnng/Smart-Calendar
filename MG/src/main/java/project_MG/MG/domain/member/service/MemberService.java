package project_MG.MG.domain.member.service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import project_MG.MG.domain.jwt.dto.JWTResponseDTO;
import project_MG.MG.domain.jwt.service.JwtService;
import project_MG.MG.domain.member.DTO.CustomOAuth2User;
import project_MG.MG.domain.member.DTO.MemberRequestDTO;
import project_MG.MG.domain.member.DTO.MemberResponseDTO;
import project_MG.MG.domain.member.entity.Member;
import project_MG.MG.domain.member.entity.SocialProviderType;
import project_MG.MG.domain.member.entity.UserRoleType;
import project_MG.MG.domain.member.repository.MemberRepository;
import project_MG.MG.util.JWTUtil;

@Service
public class MemberService extends DefaultOAuth2UserService implements UserDetailsService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    public MemberService(MemberRepository memberRepository , PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    /**
     * sign-in
     */

    @Transactional(readOnly = true)
    public Boolean existUser(MemberRequestDTO dto) {
        return memberRepository.existsByEmail(dto.getEmail());
    } //check if username exists (before sing-up)

    @Transactional
    public Long join(MemberRequestDTO dto) {
        if(memberRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("Already exist member.");
        } // one more check (redundant, but for safety) (just in case of, postman or other tool bypassing front-end check)

        Member member = Member.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .isLock(false)
                .isSocial(false)
                .roleType(UserRoleType.USER) // default role
                //.nickname(dto.getNickname())
                //.email(dto.getEmail())
                .build();

        return memberRepository.save(member).getId();
    } // sing-up(not social id)

    //sign-in
    @Transactional(readOnly = true) // read from DB
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Member member = memberRepository.findByEmailAndIsLockAndIsSocial(email, false, false)
                .orElseThrow(() -> new UsernameNotFoundException(email + " not found."));

        return User.builder()
                .username(member.getEmail())
                .password(member.getPassword())
                .roles(member.getRoleType().toString())
                .build();
    }
    @Transactional
    public JWTResponseDTO updateMember(MemberRequestDTO dto) throws AccessDeniedException {

        String sessionEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        Member member = memberRepository.findByEmailAndIsLockAndIsSocial(sessionEmail, false, false)
                .orElseThrow(() -> new UsernameNotFoundException(sessionEmail));

        boolean emailChanged = false;
        // email change request -> duplicate check -> change!
        if (dto.getEmail() != null && !dto.getEmail().equals(sessionEmail)) {
            if (memberRepository.existsByEmail(dto.getEmail())) {
                throw new IllegalStateException("Already exist member.");
            }
            member.updateEmail(dto.getEmail());
            emailChanged = true;
        }

        // password change
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            member.updatePassword(passwordEncoder.encode(dto.getPassword()));
        }

        memberRepository.save(member);

        // after change email, remove previous refresh token
        if (emailChanged) {
            jwtService.removeRefreshUser(sessionEmail);
        }

        // renew token
        String role = "ROLE_" + member.getRoleType().name();
        String currentEmail = member.getEmail();
        String newAccessToken = JWTUtil.createJWT(currentEmail, role, true);
        String newRefreshToken = JWTUtil.createJWT(currentEmail, role, false);
        jwtService.addRefresh(currentEmail, newRefreshToken);

        return new JWTResponseDTO(newAccessToken, newRefreshToken);
    }// update user info (not social id)

    //social sign-in(google)
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        // data
        Map<String, Object> attributes;
        List<GrantedAuthority> authorities;

        String email;
        String role = UserRoleType.USER.name();

        //provider (for now, only google)
        String registrationId = userRequest.getClientRegistration().getRegistrationId().toUpperCase();

        if (registrationId.equals(SocialProviderType.GOOGLE.name())) {
            attributes = (Map<String, Object>) oAuth2User.getAttributes();
            email = attributes.get("email").toString();
        }
        else {
            throw new OAuth2AuthenticationException("not supporting login.");
        }

        // DB check -> save if not exist
        Optional<Member> entity = memberRepository.findByEmail(email);

        if(entity.isPresent()) {

            //role check
            role = entity.get().getRoleType().name();
            // existing user - keep as is
        }
        else {
            // create new user
            Member member = Member.builder()
                    .email(email)
                    .password("")
                    .isLock(false)
                    .isSocial(true)
                    .socialProviderType(SocialProviderType.valueOf(registrationId))
                    .roleType(UserRoleType.USER)
                    //.nickname(nickname)
                    //.email(email)
                    .build();

            memberRepository.save(member);
        }
        authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

        return new CustomOAuth2User(attributes, authorities, email);
    }

    // user deletion
    @Transactional
    public void deleteUser(MemberRequestDTO dto) throws AccessDeniedException {
        // only admin or the user himself can delete the account
        SecurityContext context = SecurityContextHolder.getContext();
        String sessionUsername = context.getAuthentication().getName();
        String sessionRole = context.getAuthentication().getAuthorities().iterator().next().getAuthority();
        Member member = memberRepository.findByEmailAndIsLock(dto.getEmail(), false)
                .orElseThrow(() -> new UsernameNotFoundException(dto.getEmail()));

        boolean isOwner = sessionUsername.equals(dto.getEmail());
        boolean isAdmin = sessionRole.equals("ROLE_"+UserRoleType.ADMIN.name());

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("you cant delete!");
        }

        // verify current password for owner (skip for admin forced delete)
        if (isOwner && dto.getPassword() != null && !dto.getPassword().isBlank()) {
            if (!passwordEncoder.matches(dto.getPassword(), member.getPassword())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "password mismatch");
            }
        } else if (isOwner && (dto.getPassword() == null || dto.getPassword().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "password required to delete account");
        }
        //user delete
        memberRepository.deleteByEmail(dto.getEmail());
        // refresh token delete
        jwtService.removeRefreshUser(dto.getEmail());
    }

    // user serach
    @Transactional(readOnly = true)
    public MemberResponseDTO readUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        //anonymousUser check
        //~~~~

        Member member = memberRepository.findByEmailAndIsLock(email, false)
                .orElseThrow(() -> new UsernameNotFoundException(email + " not found."));

        return new MemberResponseDTO(email, member.getIsSocial());
    }

}

