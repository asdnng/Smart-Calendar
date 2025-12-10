package project_MG.MG.domain.member.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberRequestDTO {

    public interface existGroup {}
    public interface addGroup {}
    public interface updateGroup {}
    public interface deleteGroup {}

    @Email @NotBlank(groups = {existGroup.class, addGroup.class, updateGroup.class, deleteGroup.class})
    private String email;
    @Size(min = 4, groups = {addGroup.class, updateGroup.class, deleteGroup.class}) // optional on update; required on delete
    private String password;
//    @NotBlank(groups = {addGroup.class, updateGroup.class})
//    private String nickname;
//    @Email(groups = {addGroup.class, updateGroup.class})
//    private String email;
}
