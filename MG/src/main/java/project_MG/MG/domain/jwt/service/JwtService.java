package project_MG.MG.domain.jwt.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project_MG.MG.domain.jwt.dto.JWTResponseDTO;
import project_MG.MG.domain.jwt.dto.RefreshRequestDTO;
import project_MG.MG.domain.jwt.entity.RefreshEntity;
import project_MG.MG.domain.jwt.repository.RefreshRepository;
import project_MG.MG.util.JWTUtil;

@Service
public class JwtService {

    private RefreshRepository refreshRepository;

    public JwtService(RefreshRepository refreshRepository) {
        this.refreshRepository = refreshRepository;
    }

    //cookie after social login -> response header
    @Transactional
    public JWTResponseDTO cookie2Header(
            HttpServletRequest request,
            HttpServletResponse response
    ) {

        // cookie list
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            throw new RuntimeException("cookie does not exist.");
        }

        // get Refresh token
        String refreshToken = null;
        for (Cookie cookie : cookies) {
            if ("refreshToken".equals(cookie.getName())) {
                refreshToken = cookie.getValue();
                break;
            }
        }

        if (refreshToken == null) {
            throw new RuntimeException("refreshToken cookie does not exist.");
        }

        // Refresh token verification
        Boolean isValid = JWTUtil.isValid(refreshToken, false);
        if (!isValid) {
            throw new RuntimeException("Invalid refreshToken.");
        }

        // info extraction
        String username = JWTUtil.getUsername(refreshToken);
        String role = JWTUtil.getRole(refreshToken);

        // token creation
        String newAccessToken = JWTUtil.createJWT(username, role, true);
        String newRefreshToken = JWTUtil.createJWT(username, role, false);

        // Delete existing Refresh token in DB and add a new one
        RefreshEntity newRefreshEntity = RefreshEntity.builder()
                .username(username)
                .refresh(newRefreshToken)
                .build();

        removeRefresh(refreshToken);
        refreshRepository.flush();
        refreshRepository.save(newRefreshEntity);

        // Delete existing Refresh token cookie
        Cookie refreshCookie = new Cookie("refreshToken", null);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(10);
        response.addCookie(refreshCookie);

        return new JWTResponseDTO(newAccessToken, newRefreshToken);
    }

    // Access token reissue by Refresh token
    @Transactional
    public JWTResponseDTO refreshRotate(RefreshRequestDTO dto) {

        String refreshToken = dto.getRefreshToken();

        // Refresh token verification
        Boolean isValid = JWTUtil.isValid(refreshToken, false);
        if (!isValid) {
            throw new RuntimeException("Invalid refreshToken.");
        }

        // check RefreshEntity (whitelist)
        if (!existsRefresh(refreshToken)) {
            throw new RuntimeException("Invalid refreshToken.");
        }

        // info extraction
        String username = JWTUtil.getUsername(refreshToken);
        String role = JWTUtil.getRole(refreshToken);

        // token creation
        String newAccessToken = JWTUtil.createJWT(username, role, true);
        String newRefreshToken = JWTUtil.createJWT(username, role, false);

        // Delete existing Refresh token in DB and add a new one
        RefreshEntity newRefreshEntity = RefreshEntity.builder()
                .username(username)
                .refresh(newRefreshToken)
                .build();

        removeRefresh(refreshToken);
        refreshRepository.save(newRefreshEntity);

        return new JWTResponseDTO(newAccessToken, newRefreshToken);
    }

    //JWT refresh token issue and save
    @Transactional
    public void addRefresh(String username, String refreshToken) {
        RefreshEntity entity = RefreshEntity.builder()
                .username(username)
                .refresh(refreshToken)
                .build();

        refreshRepository.save(entity);
    }

    //JWT token exist check
    @Transactional(readOnly = true)
    public Boolean existsRefresh(String refreshToken) {
        return refreshRepository.existsByRefresh(refreshToken);
    }

    //JWT refresh token delete
    @Transactional
    public void removeRefresh(String refreshToken) {
        refreshRepository.deleteByrefresh(refreshToken);
    }

    //JWT delete all tokens by username (for account deletion)
    public void removeRefreshUser(String username) {
        refreshRepository.deleteByUsername(username);
    }

}
