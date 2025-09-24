package project_MG.MG.domain.member.service;

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
import project_MG.MG.domain.jwt.service.JwtService;
import project_MG.MG.domain.member.DTO.CustomOAuth2User;
import project_MG.MG.domain.member.DTO.MemberRequestDTO;
import project_MG.MG.domain.member.DTO.MemberResponseDTO;
import project_MG.MG.domain.member.DTO.MemberResponseDTO;
import project_MG.MG.domain.member.entity.Member;
import project_MG.MG.domain.member.entity.SocialProviderType;
import project_MG.MG.domain.member.entity.UserRoleType;
import project_MG.MG.domain.member.repository.MemberRepository;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
        return memberRepository.existsByUsername(dto.getUsername());
    } //check if username exists (before sing-up)

    @Transactional
    public Long join(MemberRequestDTO dto) {
        if(memberRepository.existsByUsername(dto.getUsername())) {
            throw new IllegalStateException("Already exist member.");
        } // one more check (redundant, but for safety) (just in case of, postman or other tool bypassing front-end check)

        Member member = Member.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .isLock(false)
                .isSocial(false)
                .roleType(UserRoleType.USER) // default role
                .nickname(dto.getNickname())
                .email(dto.getEmail())
                .build();

        return memberRepository.save(member).getId();
    } // sing-up(not social id)

    //sign-in
    @Transactional(readOnly = true) // read from DB
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = memberRepository.findByUsernameAndIsLockAndIsSocial(username, false, false)
                .orElseThrow(() -> new UsernameNotFoundException(username + " not found."));

        return User.builder()
                .username(member.getUsername())
                .password(member.getPassword())
                .roles(member.getRoleType().toString())
                .build();
    }
    @Transactional
    public Long updateMember(MemberRequestDTO dto) throws AccessDeniedException {

        String sessionMembername = SecurityContextHolder.getContext().getAuthentication().getName();
        if(!sessionMembername.equals(dto.getUsername())) {
            throw new AccessDeniedException("You can only update your own information.");
        }

        //searching
        Member member = memberRepository.findByUsernameAndIsLockAndIsSocial(dto.getUsername(), false, false)
                .orElseThrow(() -> new UsernameNotFoundException(dto.getUsername()));

        //updating
        member.updateMember(dto);

        return memberRepository.save(member).getId();
    }// update user info (not social id)

    //social sign-in(google)
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        // data
        Map<String, Object> attributes;
        List<GrantedAuthority> authorities;

        String username;
        String role = UserRoleType.USER.name();
        String email;
        String nickname;

        //provider (for now, only google)
        String registrationId = userRequest.getClientRegistration().getRegistrationId().toUpperCase();

        if (registrationId.equals(SocialProviderType.GOOGLE.name())) {
            attributes = (Map<String, Object>) oAuth2User.getAttributes();
            username = registrationId + "_" + attributes.get("sub");
            email = attributes.get("email").toString();
            nickname = attributes.get("name").toString();
        }
        else {
            throw new OAuth2AuthenticationException("not supporting login.");
        }

        // DB check -> save if not exist
        Optional<Member> entity = memberRepository.findByUsernameAndIsSocial(username, false);

        if(entity.isPresent()) {

            //role check
            role = entity.get().getRoleType().name();

            // update existing user
            MemberRequestDTO dto = new MemberRequestDTO();
            dto.setNickname(nickname);
            dto.setEmail(email);
            entity.get().updateMember(dto);

            memberRepository.save(entity.get());
        }
        else {
            // create new user
            Member member = Member.builder()
                    .username(username)
                    .password("")
                    .isLock(false)
                    .isSocial(true)
                    .socialProviderType(SocialProviderType.valueOf(registrationId))
                    .roleType(UserRoleType.USER)
                    .nickname(nickname)
                    .email(email)
                    .build();

            memberRepository.save(entity.get());
        }
        authorities = List.of(new SimpleGrantedAuthority(role));

        return new CustomOAuth2User(attributes, authorities, username);
    }

    // user deletion
    @Transactional
    public void deleteUser(MemberRequestDTO dto) throws AccessDeniedException {
        // only admin or the user himself can delete the account
        SecurityContext context = SecurityContextHolder.getContext();
        String sessionUsername = context.getAuthentication().getName();
        String sessionRole = context.getAuthentication().getAuthorities().iterator().next().getAuthority();

        boolean isOwner = sessionUsername.equals(dto.getUsername());
        boolean isAdmin = sessionRole.equals("ROLE_"+UserRoleType.ADMIN.name());

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("you cant delete!");
        }
        //user delete
        memberRepository.deleteByUsername(dto.getUsername());
        // refresh token delete
        jwtService.removeRefreshUser(dto.getUsername());
    }

    // user serach
    @Transactional(readOnly = true)
    public MemberResponseDTO readUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        //anonymousUser check
        //~~~~

        Member member = memberRepository.findByUsernameAndIsLock(username, false)
                .orElseThrow(() -> new UsernameNotFoundException(username + " not found."));

        return new MemberResponseDTO(username, member.getIsSocial(), member.getNickname(), member.getEmail());
    }

}

