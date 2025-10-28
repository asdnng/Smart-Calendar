package project_MG.MG.Task.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project_MG.MG.Task.entity.TaskEntity;
import project_MG.MG.Task.repository.TaskRepository;
import project_MG.MG.domain.member.entity.Member;
import project_MG.MG.domain.member.repository.MemberRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final MemberRepository memberRepository;

    public TaskEntity createTask(TaskEntity taskRequest) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Member not found: " + email));

        TaskEntity task = TaskEntity.builder()
                .title(taskRequest.getTitle())
                .description(taskRequest.getDescription())
                .startTime(taskRequest.getStartTime())
                .endTime(taskRequest.getEndTime())
                .member(member)
                .build();

        return taskRepository.save(task);
    }

    public List<TaskEntity> getMyTasks() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Member not found: " + email));
        return taskRepository.findByMember(member);
    }
}
