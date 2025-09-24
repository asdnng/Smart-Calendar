//package project_MG.MG.repository;
//import org.springframework.stereotype.Repository;
//import project_MG.MG.domain.entity.Member;
//
//import java.util.*;
//
//
//@Repository
//public class MemoryMemberRepository implements MemberRepository {
//
//    private Map<Long, Member> store = new HashMap<>(); // member store
//    private Long sequence = 8L; // key value generator
//
//    @Override
//    public Member save(Member member) {
//        member.setId(++sequence); // id value generator
//        store.put(member.getId(), member); // store member
//        return member; // return saved member
//    }
//
//    @Override
//    public Optional<Member> findById(Long id) {
//        return Optional.ofNullable(store.get(id)); // 'optional' to handle null values
//    }
//
//    @Override
//    public Optional<Member> findByName(String name) {
//        return store.values().stream()
//                .filter(member -> member.getName().equals(name)) // filter to pass only true elements, i.e., those where member.getName() equals name
//                .findAny(); // find member by name
//    }
//
//    @Override
//    public List<Member> findAll() {
//        return new ArrayList<>( store.values()); // return all members (Member objects) in the store as a list
//    }
//
//    public void clearStore() {
//        store.clear(); // clear member store
//    }
//}
