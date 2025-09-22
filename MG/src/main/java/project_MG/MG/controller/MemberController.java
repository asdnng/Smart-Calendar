package project_MG.MG.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import project_MG.MG.domain.Member;
import project_MG.MG.service.MemberService;

import java.net.URI;
import java.util.List;

@RestController
//@RequestMapping("/api/members")
public class MemberController {
    private final MemberService memberService;
    @Autowired
    public MemberController(MemberService memberService) { this.memberService = memberService; }

//    @PostMapping
//    public ResponseEntity<Long> join(@RequestBody Member member) {
//        Long id = memberService.join(member);
//        URI location = ServletUriComponentsBuilder
//                .fromCurrentRequest().path("/{id}")
//                .buildAndExpand(id).toUri();
//        return ResponseEntity.created(location).body(id);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Member> find(@PathVariable Long id) {
//        return memberService.findOne(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }

    @GetMapping("/members/new")
    public String createFrom() {
        return "members/createMemberForm";
    }


    @GetMapping
    public List<Member> listMembers() {
        return memberService.findMembers();
    }
}