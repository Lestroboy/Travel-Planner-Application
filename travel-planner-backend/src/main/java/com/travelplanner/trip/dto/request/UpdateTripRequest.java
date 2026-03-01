package com.travelplanner.trip.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTripRequest {
    private String tripName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String destinationCity;
    private String destinationCountry;
    private BigDecimal totalBudget;
    private String currency;
    private String tripStatus;
    private String visibility;
}
