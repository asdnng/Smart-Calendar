package project_MG.MG.domain.Task.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import project_MG.MG.domain.Task.DTO.AiTaskRequestDTO;
import project_MG.MG.domain.Task.DTO.TaskRequestDTO;

import java.time.LocalDate;
import java.util.List;

@Component
public class AiClientService {

    private final ChatClient chatClient;
    private final ObjectMapper mapper = new ObjectMapper().findAndRegisterModules();

    private final boolean mockMode = true;

    public AiClientService(ChatClient.Builder builder) {
        // Spring AI auto-configures the builder using your spring.ai.openai.* properties
        this.chatClient = builder.build();
    }

    public List<TaskRequestDTO> generateTasksFromPrompt(AiTaskRequestDTO req, int maxTasks) {
        if (mockMode) {
            return List.of(
                    TaskRequestDTO.builder()
                            .taskName("Mock English practice: speaking")
                            .category("study")
                            .date(LocalDate.now().plusDays(1).toString())
                            .startTime("20:00")
                            .endTime("20:20")
                            .description("Talk about your day in English")
                            .build(),
                    TaskRequestDTO.builder()
                            .taskName("Mock English practice: writing")
                            .category("study")
                            .date(LocalDate.now().plusDays(2).toString())
                            .startTime("20:00")
                            .endTime("20:20")
                            .description("Write a short diary in English")
                            .build()
            );
        }

        String today = LocalDate.now().toString();
        String baseDate = req.getPreferredDate() != null ? req.getPreferredDate() : today;

        String systemPrompt = """
            You are an assistant that converts natural language goals into structured tasks.

            OUTPUT STRICT JSON ONLY:
            [
              {
                "taskName": "string",
                "category": "string or null",
                "date": "YYYY-MM-DD or null",
                "startTime": "HH:MM or null",
                "endTime": "HH:MM or null",
                "description": "string or null"
              }
            ]

            RULES:
            - Output ONLY a JSON array. No explanation.
            - Max tasks: %d
            - If no date provided by user, use %s.
            """.formatted(maxTasks, baseDate);

        String json = callLlmApi(systemPrompt, req.getPrompt());

        try {
            return mapper.readValue(json, new TypeReference<List<TaskRequestDTO>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Could not parse AI JSON: " + json, e);
        }
    }

    private String callLlmApi(String systemPrompt, String userPrompt) {

        String result = chatClient
                .prompt()
                .system(systemPrompt)
                .user(userPrompt)
                .call()
                .content();

        result = result.strip();

        // Clean markdown fences if the model uses them
        if (result.startsWith("```")) {
            result = result.replace("```json", "")
                    .replace("```", "")
                    .trim();
        }

        return result;
    }
}
