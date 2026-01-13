package com.sahil.pfba.llm;

import com.sahil.pfba.insights.Insight;

public interface LLMClient {

    String generateExplanation(Insight insight);
}
