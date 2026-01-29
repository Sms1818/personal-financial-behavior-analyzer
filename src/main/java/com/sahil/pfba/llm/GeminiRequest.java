package com.sahil.pfba.llm;

import java.util.List;

import com.sahil.pfba.insights.JsonUtil;
import com.sahil.pfba.insights.summary.ExpenseSummary;

public record GeminiRequest(List<Content> contents) {

        public static GeminiRequest fromExpenseSummary(
                        ExpenseSummary summary) {

                String prompt = """
                                                                You are a personal finance intelligence system.

                                                                Analyze the user's expense data and generate MULTIPLE insights.

                                                                Return ONLY valid JSON.

                                                                Rules:
                                                                - Generate between 3 and 5 insights
                                                                - Each insight must be different
                                                                - Do not repeat the same category twice
                                                                - Focus on spending behavior, risks, patterns, and opportunities
                                                                - Assign HIGH only for serious financial risk
                                                                - Assign MEDIUM for optimization opportunities
                                                                - Assign LOW for informational insights


                                                                JSON Schema:
                                                                {
                                                                  "insights": [
                                                                    {
                                                                      "title": "string",
                                                                      "summary": "string",
                                                                      "severity": "LOW | MEDIUM | HIGH",
                                                                      "drivers": ["string"],
                                                                      "impact": "string",
                                                                      "recommendations": ["string"],
                                                                      "confidence": number between 0 and 1
                                                                    }
                                                                  ]
                                                                }

                                                                User expense summary:
                                                                %s
                                                                """
                                .formatted(JsonUtil.toJson(summary));

                return new GeminiRequest(
                                List.of(
                                                new Content(
                                                                List.of(new Part(prompt)))));
        }

        public record Content(List<Part> parts) {
        }

        public record Part(String text) {
        }
}
