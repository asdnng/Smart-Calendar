package project_MG.MG.domain.Task.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project_MG.MG.domain.Task.DTO.AiTaskRequestDTO;
import project_MG.MG.domain.Task.DTO.TaskRequestDTO;
import project_MG.MG.domain.Task.DTO.TaskResponseDTO;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiTaskService {

    private final TaskService taskService;
    private final AiClientService aiClientService;   // wrapper for your LLM API

    @Transactional
    public List<TaskResponseDTO> generateAndCreateTasks(AiTaskRequestDTO aiRequest) {

        int maxTasks = aiRequest.getMaxTasks() != null ? aiRequest.getMaxTasks() : 10;

        // 1. Ask AI for a list of suggested tasks in structured form
        List<TaskRequestDTO> suggestions =
                aiClientService.generateTasksFromPrompt(aiRequest, maxTasks);

        // 2. Create tasks via existing logic
        List<TaskResponseDTO> created = new ArrayList<>();
        for (TaskRequestDTO suggestion : suggestions) {
            // ensure some sensible defaults if AI leaves fields null
            if (suggestion.getCategory() == null) {
                suggestion.setCategory(aiRequest.getDefaultCategory());
            }
            created.add(taskService.createTask(suggestion));
        }

        return created;
    }
}
