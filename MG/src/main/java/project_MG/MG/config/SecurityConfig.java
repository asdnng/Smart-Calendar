package project_MG.MG.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import project_MG.MG.domain.jwt.service.JwtService;
import project_MG.MG.domain.member.entity.UserRoleType;
import project_MG.MG.filter.JWTFilter;
import project_MG.MG.filter.LoginFilter;
import project_MG.MG.handler.RefreshTokenLogoutHandler;

import java.util.List;

import static org.springframework.security.authorization.SingleResultAuthorizationManager.permitAll;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final AuthenticationSuccessHandler loginSuccessHandler;
    private final AuthenticationSuccessHandler socialSuccessHandler;
    private final JwtService jwtService;

    //Bcrypt PasswordEncoder bean
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration,
                          @Qualifier("LoginSuccessHandler") AuthenticationSuccessHandler loginSuccessHandler,
                          @Qualifier("SocialSuccessHandler") AuthenticationSuccessHandler socialSuccessHandler, JwtService jwtService) {
        this.authenticationConfiguration = authenticationConfiguration;
        this.loginSuccessHandler = loginSuccessHandler;
        this.socialSuccessHandler = socialSuccessHandler;
        this.jwtService = jwtService;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    //CORS bean
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization", "Set-Cookie"));
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    //RoleHierarchy bean
    @Bean
    public RoleHierarchy roleHierachy() {
        return RoleHierarchyImpl.withRolePrefix("ROLE_")
                .role(UserRoleType.ADMIN.name()).implies(UserRoleType.USER.name())
                .build();
    }

    //securityFilterChain
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

        // CSRF disable
        http
                .csrf(AbstractHttpConfigurer::disable);

        //CORS setting
        http
                .cors(cors -> cors
                        .configurationSource(corsConfigurationSource()));

        //logout filter + custom logout handler
        http
                .logout(logout -> logout
                        .addLogoutHandler(new RefreshTokenLogoutHandler(jwtService)));
        // default Form filter disable
        http
                .formLogin(AbstractHttpConfigurer::disable);
        //http basic disable
        http
                .httpBasic(AbstractHttpConfigurer::disable);

        //OAuth2
        http
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(socialSuccessHandler));

        //authorize requests
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/jwt/exchange", "/jwt/refresh").permitAll()
                        .requestMatchers(HttpMethod.POST, "/user/exist", "/user").permitAll()
                        .requestMatchers(HttpMethod.GET, "/user").hasRole(UserRoleType.USER.name())
                        .requestMatchers(HttpMethod.PUT, "/user").hasRole(UserRoleType.USER.name())
                        .requestMatchers(HttpMethod.DELETE, "/user").hasRole(UserRoleType.USER.name())
                        .requestMatchers("/tasks/ai/**").authenticated()
                        .anyRequest().authenticated()
                );
        //exception handling
        http
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                        }) //401
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.sendError(HttpServletResponse.SC_FORBIDDEN);
                        }) //403
                );

        //custom filter add
        http
                .addFilterBefore(new JWTFilter(), LogoutFilter.class);

        //session filter (stateless)
        http
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        //custom filter
        http
                .addFilterBefore(new LoginFilter(authenticationManager(authenticationConfiguration), loginSuccessHandler), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
