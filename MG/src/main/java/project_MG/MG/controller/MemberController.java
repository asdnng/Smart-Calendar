package project_MG.MG.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project_MG.MG.domain.member.DTO.MemberRequestDTO;
import project_MG.MG.domain.member.DTO.MemberResponseDTO;
import project_MG.MG.domain.member.entity.Member;
import project_MG.MG.domain.member.service.MemberService;

import java.awt.*;
import java.nio.file.AccessDeniedException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
public class MemberController {
    private final MemberService memberService;

    public MemberController(MemberService memberService) { this.memberService = memberService; }

    //user exists check(duplicate check)
    @PostMapping(value = "/user/exist", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> existUserApi(
            @Validated(MemberRequestDTO.addGroup.class) @RequestBody MemberRequestDTO dto
    ) {
        return ResponseEntity.ok(memberService.existUser(dto));
    }

    //sign up
    @PostMapping(value = "/user")
    public ResponseEntity<Map<String, Long>> joinApi(
            @Validated(MemberRequestDTO.addGroup.class) @RequestBody MemberRequestDTO dto
    ) {
        Long id = memberService.join(dto);
        Map<String, Long> responseBody = Collections.singletonMap("memberId", id);
        return ResponseEntity.status(201).body(responseBody);
    }

    //user info
    @GetMapping(value = "/user", consumes = MediaType.APPLICATION_JSON_VALUE)
    public MemberResponseDTO userMeApi() {
        return memberService.readUser();
    }

    //edit user info
    @PutMapping(value = "/user", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Long> updateUserApi(
            @Validated(MemberRequestDTO.updateGroup.class) @RequestBody MemberRequestDTO dto
    ) throws AccessDeniedException {
        return ResponseEntity.status(200).body(memberService.updateMember(dto));
    }

    //delete user
    @DeleteMapping(value = "/user", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> deleteUserApi(
            @Validated(MemberRequestDTO.deleteGroup.class) @RequestBody MemberRequestDTO dto
    ) throws AccessDeniedException {

        memberService.deleteUser(dto);
        return ResponseEntity.status(200).body(true);
    }


}