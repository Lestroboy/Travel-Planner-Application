package com.travelplanner.trip.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSummaryDTO {
    private BigDecimal totalExpenses;
    private BigDecimal totalBudget;
    private BigDecimal remainingBudget;
    private Map<String, BigDecimal> expensesByCategory;
}