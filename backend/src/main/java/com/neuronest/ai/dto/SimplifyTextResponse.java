package com.neuronest.ai.dto;

import java.util.List;

public class SimplifyTextResponse {
    private String simplifiedText;
    private List<String> keyPoints;
    private List<VocabularyItem> vocabulary;
    private boolean fallbackUsed;

    public SimplifyTextResponse() {}

    public SimplifyTextResponse(String simplifiedText, List<String> keyPoints, List<VocabularyItem> vocabulary, boolean fallbackUsed) {
        this.simplifiedText = simplifiedText;
        this.keyPoints = keyPoints;
        this.vocabulary = vocabulary;
        this.fallbackUsed = fallbackUsed;
    }

    public String getSimplifiedText() { return simplifiedText; }
    public void setSimplifiedText(String simplifiedText) { this.simplifiedText = simplifiedText; }
    public List<String> getKeyPoints() { return keyPoints; }
    public void setKeyPoints(List<String> keyPoints) { this.keyPoints = keyPoints; }
    public List<VocabularyItem> getVocabulary() { return vocabulary; }
    public void setVocabulary(List<VocabularyItem> vocabulary) { this.vocabulary = vocabulary; }
    public boolean isFallbackUsed() { return fallbackUsed; }
    public void setFallbackUsed(boolean fallbackUsed) { this.fallbackUsed = fallbackUsed; }

    public static class VocabularyItem {
        private String term;
        private String definition;

        public VocabularyItem() {}
        public VocabularyItem(String term, String definition) {
            this.term = term;
            this.definition = definition;
        }

        public String getTerm() { return term; }
        public void setTerm(String term) { this.term = term; }
        public String getDefinition() { return definition; }
        public void setDefinition(String definition) { this.definition = definition; }
    }
}
