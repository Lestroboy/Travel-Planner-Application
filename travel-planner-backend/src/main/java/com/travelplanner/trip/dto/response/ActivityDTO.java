package com.travelplanner.trip.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDTO {
    private Long activityId;
    private String activityName;
    private String category;
    private String poiId;
    private BigDecimal rating;
    private Integer priceLevel;
    private String website;
    private String phone;
}