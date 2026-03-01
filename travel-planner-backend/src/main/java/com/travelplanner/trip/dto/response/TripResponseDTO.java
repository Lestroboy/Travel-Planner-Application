package com.travelplanner.trip.dto.response;


import com.travelplanner.trip.entity.TripStatus;
import com.travelplanner.trip.entity.TripVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripResponseDTO {
    private Long tripId;
    private Long userId;
    private String tripName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String destinationCity;
    private String destinationCountry;
    private BigDecimal totalBudget;
    private String currency;
    private Boolean isGroupTrip;
    private TripStatus tripStatus;
    private TripVisibility visibility;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer itemCount;
    private Integer collaboratorCount;
}
