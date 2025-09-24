package project_MG.MG.domain.jwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import project_MG.MG.domain.jwt.entity.RefreshEntity;

import java.time.LocalDateTime;

public interface RefreshRepository extends JpaRepository<RefreshEntity, Long> {

    Boolean existsByRefresh(String refreshToken);

    @Transactional
    void deleteByrefresh(String refresh);

    @Transactional
    void deleteByUsername(String username);

    @Transactional
    void deleteByCreatedDateBefore(LocalDateTime createdDate);
}
