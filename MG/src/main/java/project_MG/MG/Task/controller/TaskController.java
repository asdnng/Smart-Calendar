package project_MG.MG.Task.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project_MG.MG.Task.entity.TaskEntity;
import project_MG.MG.Task.service.TaskService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<TaskEntity> createTask(@RequestBody TaskEntity taskRequest) {
        return ResponseEntity.ok(taskService.createTask(taskRequest));
    }

    @GetMapping
    public ResponseEntity<List<TaskEntity>> getMyTasks() {
        return ResponseEntity.ok(taskService.getMyTasks());
    }
}

