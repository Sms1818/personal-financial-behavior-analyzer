package com.sahil.pfba.analysis;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.sahil.pfba.domain.Expense;

@Service
public class SpendingAnalysisService {

    @Async("analysisExecutor")
    public CompletableFuture<BigDecimal> calculateTotalSpending(List<Expense> expenses){
        System.out.println("Running analysis on thread: "+ Thread.currentThread().getName());
        if(expenses==null || expenses.isEmpty()){
            return CompletableFuture.completedFuture(BigDecimal.ZERO);
        }
        BigDecimal total=expenses.stream()
            .map(Expense::getAmount)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        try{
            Thread.sleep(2000);
        }
        catch(InterruptedException e){
            Thread.currentThread().interrupt();
        }
        return CompletableFuture.completedFuture(total);
    }
}
