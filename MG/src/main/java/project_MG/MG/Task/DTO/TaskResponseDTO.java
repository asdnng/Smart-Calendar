package project_MG.MG.Task.DTO;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponseDTO {
    private Long id;
    private String taskName;
    private String category;
    private String date;
    private String startTime;
    private String endTime;
    private String description;
    private LocalDateTime createdDate;
}
