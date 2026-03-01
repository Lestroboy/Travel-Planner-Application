package com.travelplanner.trip.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateActivityRequest {
    private String activityName;
    private String category;
    private String poiId;
    private BigDecimal rating;
    private Integer priceLevel;
    private String website;
    private String phone;
}