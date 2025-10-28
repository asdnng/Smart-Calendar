package project_MG.MG.Task.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskRequestDTO {
    private String taskName;
    private String category;
    private String date;        // e.g., "2025-10-28"
    private String startTime;   // e.g., "09:00"
    private String endTime;     // e.g., "10:00"
    private String description;
}
