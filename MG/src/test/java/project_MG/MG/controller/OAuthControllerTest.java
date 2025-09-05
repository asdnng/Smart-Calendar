package project_MG.MG.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class OAuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetGoogleCalendarOAuthUrl() throws Exception {
        String redirectUri = "http://localhost:8080/callback";

        mockMvc.perform(get("/oauth/login/google")
                        .param("redirectUri", redirectUri))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("https://accounts.google.com/o/oauth2/v2/auth")));
    }
}