package project_MG.MG.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import project_MG.MG.domain.Member;
import project_MG.MG.service.MemberService;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {
    private final MemberService memberService;
    public MemberController(MemberService memberService) { this.memberService = memberService; }

    @PostMapping
    public Long joinMember(@RequestBody Member member) {
        return memberService.join(member);
    }

    @GetMapping
    public List<Member> listMembers() {
        return memberService.findMembers();
    }
}