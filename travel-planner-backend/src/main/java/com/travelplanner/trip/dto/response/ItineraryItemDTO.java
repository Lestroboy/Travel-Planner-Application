package com.travelplanner.trip.dto.response;

import com.travelplanner.trip.entity.BookingStatus;
import com.travelplanner.trip.entity.ItemType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryItemDTO {
    private Long itemId;
    private Long tripId;
    private ItemType itemType;
    private String title;
    private String description;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    private String location;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String bookingReference;
    private BookingStatus bookingStatus;
    private BigDecimal cost;
    private String currency;
    private String notes;
    private Integer sequenceOrder;
    private Object details; // Will contain Flight/Accommodation/Activity details
}