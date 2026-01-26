// package com.sahil.pfba.llm;

// import java.util.List;

// import org.springframework.context.annotation.Profile;
// import org.springframework.stereotype.Component;

// import com.sahil.pfba.insights.InsightExplanation;
// import com.sahil.pfba.insights.InsightType;
// import com.sahil.pfba.insights.signal.InsightSignal;

// @Component
// @Profile("dev")
// public class MockLLMClient implements LLMClient {

//     @Override
//     public InsightExplanation generateInsightSummary(
//             InsightType type,
//             List<InsightSignal> signals
//     ) {
//         return new InsightExplanation(
//                 "This is a mock AI-generated insight.",
//                 List.of(
//                         "Detected " + signals.size() + " financial signals",
//                         "Pattern matches historical behavior"
//                 ),
//                 "Low to moderate financial impact",
//                 List.of(
//                         "Monitor spending trends",
//                         "Review categories monthly"
//                 ),
//                 0.78
//         );
//     }
// }
