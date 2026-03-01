package com.travelplanner.trip.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripDetailDTO {
    private TripResponseDTO trip;
    private List<ItineraryItemDTO> itineraryItems;
//    private List<CollaboratorDTO> collaborators;
//    private ExpenseSummaryDTO expenseSummary;
}
