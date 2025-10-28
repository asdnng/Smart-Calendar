package project_MG.MG.domain.jwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import project_MG.MG.domain.jwt.entity.RefreshEntity;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RefreshRepository extends JpaRepository<RefreshEntity, Long> {

    Boolean existsByRefresh(String refreshToken);

    @Transactional
    void deleteByrefresh(String refresh);

    @Transactional
    void deleteByEmail(String email);

    @Transactional
    void deleteByCreatedDateBefore(LocalDateTime createdDate);

    Optional<RefreshEntity> findByEmail(String email);

}
