package project_MG.MG.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry corsRegistry) {
        String allowedOrigins = System.getenv("ALLOWED_ORIGINS");
        if (allowedOrigins == null || allowedOrigins.isEmpty()) {
            allowedOrigins = "http://localhost:3000";
        }
        
        corsRegistry.addMapping("/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(true)
                .allowedHeaders("*")
                .exposedHeaders("Set-Cookie", "Authorization");
    }
}
