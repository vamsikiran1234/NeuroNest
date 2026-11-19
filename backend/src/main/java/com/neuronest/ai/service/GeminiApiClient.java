package com.neuronest.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.neuronest.ai.config.AiProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class GeminiApiClient {

    private static final Logger log = LoggerFactory.getLogger(GeminiApiClient.class);

    private final AiProperties aiProperties;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GeminiApiClient(AiProperties aiProperties, ObjectMapper objectMapper) {
        this.aiProperties = aiProperties;
        this.objectMapper = objectMapper;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        int timeoutMs = aiProperties.getTimeoutSeconds() != null ? aiProperties.getTimeoutSeconds() * 1000 : 15000;
        factory.setConnectTimeout(timeoutMs);
        factory.setReadTimeout(timeoutMs);

        this.restClient = RestClient.builder()
                .requestFactory(factory)
                .build();
    }

    public Optional<String> generateText(String systemInstruction, String userPrompt) {
        if (!aiProperties.isConfigured()) {
            return Optional.empty();
        }

        try {
            String combinedPrompt = (systemInstruction != null && !systemInstruction.isBlank())
                    ? systemInstruction + "\n\nUser Request: " + userPrompt
                    : userPrompt;

            Map<String, Object> requestPayload = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", combinedPrompt)))
                    ),
                    "generationConfig", Map.of(
                            "temperature", aiProperties.getTemperature(),
                            "maxOutputTokens", aiProperties.getMaxTokens()
                    )
            );

            String url = String.format(
                    "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                    aiProperties.getModel(),
                    aiProperties.getApiKey()
            );

            String responseBody = restClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestPayload)
                    .retrieve()
                    .body(String.class);

            if (responseBody == null || responseBody.isBlank()) {
                return Optional.empty();
            }

            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode textNode = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");

            if (!textNode.isMissingNode() && !textNode.asText().isBlank()) {
                return Optional.of(textNode.asText());
            }

            return Optional.empty();
        } catch (Exception e) {
            log.warn("Gemini API call failed or timed out (falling back smoothly): {}", e.getMessage());
            return Optional.empty();
        }
    }
}
