package project_MG.MG.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import project_MG.MG.domain.jwt.service.JwtService;
import project_MG.MG.util.JWTUtil;

import java.io.IOException;

@Component
@Qualifier("SocialSuccessHandler")
public class SocialSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;

    public SocialSuccessHandler(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        // username, role
        String email =  authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        // JWT(Refresh) issue
        String refreshToken = JWTUtil.createJWT(email, role, false);

        // issued Refresh save in DB table  (Refresh whitelist)
        jwtService.addRefresh(email, refreshToken);

        // response cookie setting
        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(10); // 10 sec

        response.addCookie(refreshCookie);
//        String cookieHeader = String.format(
//                "refreshToken=%s; Max-Age=%d; Path=/; Secure; HttpOnly; SameSite=None",
//                refreshToken,
//                7 * 24 * 60 * 60
//        );
//
//        response.setHeader("Set-Cookie", cookieHeader);
        response.sendRedirect("http://localhost:3000/cookie");
    }

}
