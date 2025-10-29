package project_MG.MG.domain.Task.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import project_MG.MG.domain.Task.DTO.TaskRequestDTO;
import project_MG.MG.domain.Task.DTO.TaskResponseDTO;
import project_MG.MG.domain.Task.service.TaskService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tasks")
public class TaskController {
    private final TaskService taskService;

    @GetMapping
    public List<TaskResponseDTO> getTasks() {
        return taskService.getMyTasks();
    }

    @PostMapping
    public TaskResponseDTO createTask(@RequestBody TaskRequestDTO dto) {
        return taskService.createTask(dto);
    }

    @PutMapping("/{id}")
    public TaskResponseDTO updateTask(@PathVariable Long id, @RequestBody TaskRequestDTO dto) {
        return taskService.updateTask(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}

