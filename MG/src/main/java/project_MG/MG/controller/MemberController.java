package project_MG.MG.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import project_MG.MG.domain.Member;
import project_MG.MG.service.MemberService;

@Controller
public class MemberController {
    private final MemberService memberService;
    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/api/members")
    @ResponseBody
    public Long joinMember(@RequestBody Member member) {
        return memberService.join(member);
    }

}
