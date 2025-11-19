package project_MG.MG.domain.Task.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import project_MG.MG.domain.Task.DTO.AiTaskRequestDTO;
import project_MG.MG.domain.Task.DTO.TaskResponseDTO;
import project_MG.MG.domain.Task.service.AiTaskService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tasks/ai")
public class AiTaskController {

    private final AiTaskService aiTaskService;

    /**
     * Generate tasks from natural language and create them immediately.
     * Current authenticated user is taken from SecurityContext inside TaskService.
     */
    @PostMapping
    public List<TaskResponseDTO> generateTasks(@RequestBody AiTaskRequestDTO dto) {
        return aiTaskService.generateAndCreateTasks(dto);
    }
}
