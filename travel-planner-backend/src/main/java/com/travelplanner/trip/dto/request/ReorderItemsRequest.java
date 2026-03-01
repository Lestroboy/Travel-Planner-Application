package com.travelplanner.trip.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReorderItemsRequest {

    @NotEmpty(message = "Item IDs list cannot be empty")
    private List<Long> itemIds; // New order of item IDs
}
