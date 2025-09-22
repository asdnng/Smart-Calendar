package project_MG.MG.domain.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberRequestDTO {

    private String username;
    private String password;
    private String nickname;
    private String email;
}
