package project_MG.MG.domain.Task.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project_MG.MG.domain.Task.DTO.TaskRequestDTO;
import project_MG.MG.domain.Task.DTO.TaskResponseDTO;
import project_MG.MG.domain.Task.entity.TaskEntity;
import project_MG.MG.domain.Task.repository.TaskRepository;
import project_MG.MG.domain.member.entity.Member;
import project_MG.MG.domain.member.repository.MemberRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final MemberRepository memberRepository;

    // Create task
    public TaskResponseDTO createTask(TaskRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Member not found: " + email));

        TaskEntity task = TaskEntity.builder()
                .taskName(dto.getTaskName())
                .category(dto.getCategory())
                .date(dto.getDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .description(dto.getDescription())
                .member(member)
                .build();

        TaskEntity saved = taskRepository.save(task);
        return toResponseDTO(saved);
    }

    // List tasks (for current user)
    public List<TaskResponseDTO> getMyTasks() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Member not found: " + email));
        return taskRepository.findByMember(member)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // Update task
    public TaskResponseDTO updateTask(Long id, TaskRequestDTO dto) {
        TaskEntity task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // ensure the current user owns it
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!task.getMember().getEmail().equals(email)) {
            throw new AccessDeniedException("You can only modify your own tasks");
        }

        task.setTaskName(dto.getTaskName());
        task.setCategory(dto.getCategory());
        task.setDate(dto.getDate());
        task.setStartTime(dto.getStartTime());
        task.setEndTime(dto.getEndTime());
        task.setDescription(dto.getDescription());

        return toResponseDTO(taskRepository.save(task));
    }

    // Delete task
    public void deleteTask(Long id) {
        TaskEntity task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!task.getMember().getEmail().equals(email)) {
            throw new AccessDeniedException("You can only delete your own tasks");
        }

        taskRepository.delete(task);
    }

    private TaskResponseDTO toResponseDTO(TaskEntity task) {
        return TaskResponseDTO.builder()
                .id(task.getId())
                .taskName(task.getTaskName())
                .category(task.getCategory())
                .date(task.getDate())
                .startTime(task.getStartTime())
                .endTime(task.getEndTime())
                .description(task.getDescription())
                .createdDate(task.getCreatedDate())
                .build();
    }
}
