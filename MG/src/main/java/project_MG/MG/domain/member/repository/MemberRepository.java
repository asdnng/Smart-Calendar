package project_MG.MG.domain.member.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import project_MG.MG.domain.member.entity.Member;

import java.util.Optional;


public interface MemberRepository extends JpaRepository<Member, Long> {
    Boolean existsByUsername(String username);

    Optional<Member> findByUsernameAndIsLockAndIsSocial(String username, Boolean isLock, Boolean isSocial);
    Optional<Member> findByUsernameAndIsSocial(String username, Boolean social);

    Optional<Member> findByUsernameAndIsLock(String username, Boolean isLock);

    @Transactional
    void deleteByUsername(String username);
//    Member save(Member member); // save member
//    Optional<Member> findById(Long id); // find member
//    Optional<Member> findByName(String name);
//    List<Member> findAll(); // find all members
}
