package project_MG.MG.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project_MG.MG.domain.Member;
import java.util.List;
import java.util.Optional;


public interface MemberRepository extends JpaRepository<Member, Long> {
    Boolean existsByUsername(String username);

    Optional<Member> findByUsernameAndIsLockAndIsSocial(String username, Boolean isLock, Boolean isSocial);

//    Member save(Member member); // save member
//    Optional<Member> findById(Long id); // find member
//    Optional<Member> findByName(String name);
//    List<Member> findAll(); // find all members
}
