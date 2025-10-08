package project_MG.MG.domain.member.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import project_MG.MG.domain.member.DTO.MemberRequestDTO;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "member_member_entity")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", unique = true, nullable = false, updatable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "is_lock", nullable = false)
    private Boolean isLock;

    @Column(name = "is_social", nullable = false)
    private Boolean isSocial;

    @Enumerated(EnumType.STRING)
    @Column(name = "social_provider_type")
    private SocialProviderType socialProviderType;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_type", nullable = false)
    private UserRoleType roleType;

//    @Column(name = "nickname")
//    private String nickname;
//
//    @Column(name = "email")
//    private String email;

    @CreatedDate
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;


    public void updateMember(MemberRequestDTO dto) {
        this.username = dto.getEmail();
        //this.nickname = dto.getNickname();
    }
}
