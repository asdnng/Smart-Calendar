package project_MG.MG.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import project_MG.MG.domain.jwt.dto.JWTResponseDTO;
import project_MG.MG.domain.jwt.service.JwtService;
import project_MG.MG.domain.member.DTO.MemberRequestDTO;
import project_MG.MG.domain.member.DTO.MemberResponseDTO;
import project_MG.MG.domain.member.entity.Member;
import project_MG.MG.domain.member.entity.UserRoleType;
import project_MG.MG.domain.member.service.MemberService;
import project_MG.MG.util.JWTUtil;

import java.awt.*;
import java.nio.file.AccessDeniedException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
public class MemberController {
    private final MemberService memberService;
    private final JwtService jwtService;

    public MemberController(MemberService memberService, JwtService jwtService) { this.memberService = memberService;
        this.jwtService = jwtService;}

    //user exists check(duplicate check)
    @PostMapping(value = "/user/exist", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> existUserApi(
            @Validated(MemberRequestDTO.addGroup.class) @RequestBody MemberRequestDTO dto
    ) {
        return ResponseEntity.ok(memberService.existUser(dto));
    }

    //sign up
    @PostMapping("/user")
    public ResponseEntity<JWTResponseDTO> joinApi(
            @Validated(MemberRequestDTO.addGroup.class) @RequestBody MemberRequestDTO dto
    ) {
        Long id = memberService.join(dto);

        String email = dto.getEmail();
        String role = UserRoleType.USER.name();
        String accessToken = JWTUtil.createJWT(email, role, true);
        String refreshToken = JWTUtil.createJWT(email, role, false);

        jwtService.addRefresh(email, refreshToken);
        JWTResponseDTO jwtResponse = new JWTResponseDTO(accessToken, refreshToken);
        return ResponseEntity.status(201).body(jwtResponse);
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