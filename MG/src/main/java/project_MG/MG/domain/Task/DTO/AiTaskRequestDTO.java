package project_MG.MG.domain.Task.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiTaskRequestDTO {

    /** Natural language request from user, e.g.:
     *  "I want to practice English 20 minutes every weekday for the next 2 weeks."
     */
    private String prompt;

    /** Optional: cap how many tasks AI should create (default in service). */
    private Integer maxTasks;

    /** Optional: default date string like "2025-11-15" if user doesn't specify. */
    private String preferredDate;

    /** Optional: default category to apply to tasks, e.g. "Study" */
    private String defaultCategory;
}
