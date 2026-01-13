package com.sahil.pfba.llm;
import java.util.List;

public record OpenAIRequest(String model, List<Message> message) {
    public record Message(String role,String content){}
}
