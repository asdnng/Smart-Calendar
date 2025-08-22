package project_MG.MG.repository;

import project_MG.MG.domain.Member;
import java.util.List;
import java.util.Optional;


public interface MemberRepository {
    Member save(Member member); // save member
    Optional<Member> findById(Long id); // find member
    Optional<Member> findByName(String name);
    List<Member> findAll(); // find all members
}
