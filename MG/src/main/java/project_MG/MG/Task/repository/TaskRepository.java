package project_MG.MG.Task.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project_MG.MG.Task.entity.TaskEntity;
import project_MG.MG.domain.member.entity.Member;

import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Long> {
    List<TaskEntity> findByMember(Member member);
}
