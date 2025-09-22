package project_MG.MG.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project_MG.MG.domain.DTO.MemberRequestDTO;
import project_MG.MG.domain.Member;
import project_MG.MG.domain.UserRoleType;
import project_MG.MG.repository.MemberRepository;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberService(MemberRepository memberRepository , PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
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

    @Transactional
    public Long update(MemberRequestDTO dto) throws AccessDeniedException {

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


//    public Long join(Member member){
//        // validate duplicated member
//        validateDuplicatedMember(member);
//
//        memberRepository.save(member);
//        return member.getId();
//    }
//
//    private void validateDuplicatedMember(Member member) {
//        Optional<Member> result = memberRepository.findByName(member.getName());
//        result.ifPresent(m -> {
//            throw new IllegalStateException("Already exist member.");
//        });
//    }

    public List<Member> findMembers() {
        return memberRepository.findAll();
    }

    public Optional<Member> findOne(Long memberId) {
        return memberRepository.findById(memberId);
    }
}

