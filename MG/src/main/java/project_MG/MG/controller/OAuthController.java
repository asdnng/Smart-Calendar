package project_MG.MG.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class OAuthController {
    @GetMapping("/api/oauth/login/google")
    @ResponseBody
    public String getGoogleCalendarOAuthUrl(@RequestParam("redirectUri") String redirectUri) {
        String clientId = "931682966158-2p46mkp26np0ekcf2puqaogc39e224qe.apps.googleusercontent.com";
        String scope = "https://www.googleapis.com/auth/calendar";
        String responseType = "code";

        String url = "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + clientId
                + "&redirect_uri=" + redirectUri
                + "&response_type=" + responseType
                + "&scope=" + scope;

        System.out.println("Generated URL: " + url); // Debug log
        return url;
    }
}
