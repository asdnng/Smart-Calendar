package project_MG.MG.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.query.IllegalQueryOperationException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import project_MG.MG.domain.jwt.service.JwtService;
import project_MG.MG.util.JWTUtil;

import java.io.IOException;

@Component
@Qualifier("LoginSuccessHandler") // to prevent duplicate bean error
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;

    public LoginSuccessHandler(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        //user name, role
        String email = authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        //JWT issue
        String accessToken = JWTUtil.createJWT(email, role, true);
        String refreshToken = JWTUtil.createJWT(email, role, false);

        //save refresh token
        jwtService.addRefresh(email, refreshToken);

        //set response header
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String json = String.format("{\"accessToken\":\"%s\", \"refreshToken\":\"%s\"}", accessToken, refreshToken);
        response.getWriter().write(json);
        response.getWriter().flush();
    }

}
