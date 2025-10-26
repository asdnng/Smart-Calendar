package project_MG.MG.domain.member.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import project_MG.MG.domain.member.entity.Member;

import java.util.Optional;


public interface MemberRepository extends JpaRepository<Member, Long> {
    Boolean existsByEmail(String email);

    Optional<Member> findByEmailAndIsLockAndIsSocial(String email, Boolean isLock, Boolean isSocial);
    Optional<Member> findByEmailAndIsSocial(String email, Boolean social);

    Optional<Member> findByEmailAndIsLock(String email, Boolean isLock);

    @Transactional
    void deleteByEmail(String email);
//    Member save(Member member); // save member
//    Optional<Member> findById(Long id); // find member
//    Optional<Member> findByName(String name);
//    List<Member> findAll(); // find all members
}
