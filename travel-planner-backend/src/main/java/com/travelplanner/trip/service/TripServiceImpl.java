package com.travelplanner.trip.service;

import com.travelplanner.auth.entity.User;
import com.travelplanner.exception.UnauthorizedException;
import com.travelplanner.security.SecurityUtil;
import com.travelplanner.trip.dto.request.CreateTripRequest;
import com.travelplanner.trip.dto.request.UpdateTripRequest;
import com.travelplanner.trip.dto.response.*;
import com.travelplanner.trip.entity.*;
import com.travelplanner.trip.exception.BadRequestException;
import com.travelplanner.trip.exception.ResourceNotFoundException;
import com.travelplanner.trip.repository.ItineraryItemRepository;
import com.travelplanner.trip.repository.TripCollaboratorRepository;
import com.travelplanner.trip.repository.TripRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Pageable;  // ✅ CORRECT - Spring Data

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final TripCollaboratorRepository tripCollaboratorRepository;
    private final ItineraryItemRepository itineraryItemRepository;
    private final SecurityUtil securityUtil;



    @Override
    public TripResponseDTO createTrip(CreateTripRequest request) {

        User currentUser = securityUtil.getCurrentUser();

        // Validate Trip Date
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End Date must be after start date");
        }

        // create a trip
        Trip trip = new Trip();
        trip.setUser(currentUser);
        trip.setTripName(request.getTripName());
        trip.setDescription(request.getDescription());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setDestinationCity(request.getDestinationCity());
        trip.setDestinationCountry(request.getDestinationCountry());
        trip.setTotalBudget(request.getTotalBudget());
        trip.setCurrency(request.getCurrency() != null ? request.getCurrency() : "INR" );
        trip.setIsGroupTrip(request.getIsGroupTrip() != null ? request.getIsGroupTrip() : false );
        trip.setTripStatus(TripStatus.PLANNING);

        trip = tripRepository.save(trip);

        if (trip.getIsGroupTrip()) {
            TripCollaborator collaborator = new TripCollaborator();
            collaborator.setTrip(trip);
            collaborator.setUser(currentUser);
            collaborator.setRole(CollaborationRole.OWNER);
            collaborator.setStatus(CollaborationStatus.ACCEPTED);

            tripCollaboratorRepository.save(collaborator);
        }

        return convertToResponseDTO(trip);

    }

    @Override
    @Transactional(readOnly = true)
    public TripDetailDTO getTripById(Long tripId) {
        Trip trip = getTripWithAccessCheck(tripId);

//        // Get itinerary items
//        List<ItineraryItem> items = itineraryItemRepository.findByTripTripIdOrderBySequenceOrderAsc(tripId);
//        List<ItineraryItemDTO> itemDTOs = items.stream()
//                .map(this::convertToItineraryItemDTO)
//                .collect(Collectors.toList());

//        // Get collaborators
//        List<TripCollaborator> collaborators = tripCollaboratorRepository.findByTripTripId(tripId);
//        List<CollaboratorDTO> collaboratorDTOs = collaborators.stream()
//                .map(this::convertToCollaboratorDTO)
//                .collect(Collectors.toList());

        // Get expense summary
//        ExpenseSummaryDTO expenseSummary = calculateExpenseSummary(tripId, trip.getTotalBudget());

        return TripDetailDTO.builder()
                .trip(convertToResponseDTO(trip)).build();
//                .itineraryItems(itemDTOs)
//                .collaborators(collaboratorDTOs)
//                .expenseSummary(expenseSummary)
    }


    @Override
    @Transactional
    public TripResponseDTO updateTrip(Long tripId, UpdateTripRequest request) {
        Trip trip = getTripWithAccessCheck(tripId);

        // Check if user has edit permission
        if (!hasEditPermission(trip)) {
            throw new UnauthorizedException("You don't have permission to edit this trip");
        }

        // Update fields if provided
        if (request.getTripName() != null) {
            trip.setTripName(request.getTripName());
        }
        if (request.getDescription() != null) {
            trip.setDescription(request.getDescription());
        }
        if (request.getStartDate() != null) {
            trip.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            trip.setEndDate(request.getEndDate());
        }
        if (request.getDestinationCity() != null) {
            trip.setDestinationCity(request.getDestinationCity());
        }
        if (request.getDestinationCountry() != null) {
            trip.setDestinationCountry(request.getDestinationCountry());
        }
        if (request.getTotalBudget() != null) {
            trip.setTotalBudget(request.getTotalBudget());
        }
        if (request.getCurrency() != null) {
            trip.setCurrency(request.getCurrency());
        }
        if (request.getTripStatus() != null) {
            trip.setTripStatus(TripStatus.valueOf(request.getTripStatus()));
        }
//        if (request.getVisibility() != null) {
//            trip.setVisibility(TripVisibility.valueOf(request.getVisibility()));
//        }

        // Validate dates
        if (trip.getEndDate().isBefore(trip.getStartDate())) {
            throw new BadRequestException("End date must be after start date");
        }

        trip = tripRepository.save(trip);
        return convertToResponseDTO(trip);
    }

    @Override
    @Transactional
    public void deleteTrip(Long tripId) {
        Trip trip = getTripWithAccessCheck(tripId);

        // Only owner can delete
        Long currentUserId = securityUtil.getCurrentUserId();
        if (!trip.getUser().getUserId().equals(currentUserId)) {
            throw new UnauthorizedException("Only trip owner can delete the trip");
        }

        tripRepository.delete(trip);
    }



    @Override
    @Transactional(readOnly = true)
    public Page<TripResponseDTO> getAllTrips(Pageable pageable) {
        Long currentUserId = securityUtil.getCurrentUserId();
        Page<Trip> trips = tripRepository.findAllAccessibleTrips(currentUserId, pageable);  // Remove cast
        return trips.map(this::convertToResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TripResponseDTO> getTripsByStatus(String status, Pageable pageable) {
        Long currentUserId = securityUtil.getCurrentUserId();
        TripStatus tripStatus = TripStatus.valueOf(status.toUpperCase());
        Page<Trip> trips = tripRepository.findByUserUserIdAndTripStatus(currentUserId, tripStatus, pageable);  // Remove cast
        return trips.map(this::convertToResponseDTO);
    }

    @Override
    @Transactional
    public TripResponseDTO duplicateTrip(Long tripId) {
        Trip originalTrip = getTripWithAccessCheck(tripId);
        User currentUser = securityUtil.getCurrentUser();

        // Create duplicate trip
        Trip duplicateTrip = new Trip();
        duplicateTrip.setUser(currentUser);
        duplicateTrip.setTripName(originalTrip.getTripName() + " (Copy)");
        duplicateTrip.setDescription(originalTrip.getDescription());
        duplicateTrip.setStartDate(originalTrip.getStartDate());
        duplicateTrip.setEndDate(originalTrip.getEndDate());
        duplicateTrip.setDestinationCity(originalTrip.getDestinationCity());
        duplicateTrip.setDestinationCountry(originalTrip.getDestinationCountry());
        duplicateTrip.setTotalBudget(originalTrip.getTotalBudget());
        duplicateTrip.setCurrency(originalTrip.getCurrency());
        duplicateTrip.setIsGroupTrip(false); // Don't copy group status
        duplicateTrip.setTripStatus(TripStatus.PLANNING);
//        duplicateTrip.setVisibility(TripVisibility.PRIVATE);

        duplicateTrip = tripRepository.save(duplicateTrip);

        // Copy itinerary items (without booking references)
        List<ItineraryItem> originalItems = itineraryItemRepository.findByTripTripIdOrderBySequenceOrderAsc(tripId);
        for (ItineraryItem originalItem : originalItems) {
            ItineraryItem newItem = new ItineraryItem();
            newItem.setTrip(duplicateTrip);
            newItem.setItemType(originalItem.getItemType());
            newItem.setTitle(originalItem.getTitle());
            newItem.setDescription(originalItem.getDescription());
            newItem.setStartDatetime(originalItem.getStartDatetime());
            newItem.setEndDatetime(originalItem.getEndDatetime());
            newItem.setLocation(originalItem.getLocation());
            newItem.setLatitude(originalItem.getLatitude());
            newItem.setLongitude(originalItem.getLongitude());
            newItem.setCost(originalItem.getCost());
            newItem.setCurrency(originalItem.getCurrency());
            newItem.setNotes(originalItem.getNotes());
            newItem.setSequenceOrder(originalItem.getSequenceOrder());
            // Don't copy bookingReference, bookingStatus

            itineraryItemRepository.save(newItem);
        }

        return convertToResponseDTO(duplicateTrip);
    }


    // Helper Methods
    private TripResponseDTO convertToResponseDTO(Trip trip) {

        // TODO : Add ItineraryItems
//        Integer collaboratorCount = tripCollaboratorRepository.countByTripId(trip.getTripId());

        return TripResponseDTO.builder()
                .tripId(trip.getTripId())
                .userId(trip.getUser().getUserId())
                .tripName(trip.getTripName())
                .description(trip.getDescription())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .destinationCity(trip.getDestinationCity())
                .destinationCountry(trip.getDestinationCountry())
                .totalBudget(trip.getTotalBudget())
                .currency(trip.getCurrency())
                .isGroupTrip(trip.getIsGroupTrip())
                .tripStatus(trip.getTripStatus())
                .createdAt(trip.getCreatedAt())
                .updatedAt(trip.getUpdatedAt())
//                .collaboratorCount(collaboratorCount)
                .build();
    }

    private Trip getTripWithAccessCheck(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        Long currentUserId = securityUtil.getCurrentUserId();

        // Check if user is owner or collaborator
        boolean isOwner = trip.getUser().getUserId().equals(currentUserId);
        boolean isCollaborator = tripCollaboratorRepository.hasAccess(tripId, currentUserId);

        if (!isOwner && !isCollaborator) {
            throw new UnauthorizedException("You don't have access to this trip");
        }

        return trip;
    }


    private boolean hasEditPermission(Trip trip) {
        Long currentUserId = securityUtil.getCurrentUserId();

        // Owner always has edit permission
        if (trip.getUser().getUserId().equals(currentUserId)) {
            return true;
        }

        // Check if collaborator has EDITOR or OWNER role
        // ✅ CORRECT - calling instance method
        return tripCollaboratorRepository.findByTripTripIdAndUserUserId(trip.getTripId(), currentUserId)
                .map(collab -> collab.getRole() == CollaborationRole.OWNER ||
                        collab.getRole() == CollaborationRole.EDITOR)
                .orElse(false);
    }


    private ItineraryItemDTO convertToItineraryItemDTO(ItineraryItem item) {
        return ItineraryItemDTO.builder()
                .itemId(item.getItemId())
                .tripId(item.getTrip().getTripId())
                .itemType(item.getItemType())
                .title(item.getTitle())
                .description(item.getDescription())
                .startDatetime(item.getStartDatetime())
                .endDatetime(item.getEndDatetime())
                .location(item.getLocation())
                .latitude(item.getLatitude())
                .longitude(item.getLongitude())
                .bookingReference(item.getBookingReference())
                .bookingStatus(item.getBookingStatus())
                .cost(item.getCost())
                .currency(item.getCurrency())
                .notes(item.getNotes())
                .sequenceOrder(item.getSequenceOrder())
                .build();
    }

//    private CollaboratorDTO convertToCollaboratorDTO(TripCollaborator collaborator) {
//        User user = collaborator.getUser();
//        return CollaboratorDTO.builder()
//                .collaborationId(collaborator.getCollaborationId())
//                .userId(user.getUserId())
//                .email(user.getEmail())
//                .fullName(user.getFullName())
//                .profilePictureUrl(user.getProfilePictureUrl())
//                .role(collaborator.getRole())
//                .status(collaborator.getStatus())
//                .invitedAt(collaborator.getInvitedAt())
//                .acceptedAt(collaborator.getAcceptedAt())
//                .build();
//    }
//
//    private ExpenseSummaryDTO calculateExpenseSummary(Long tripId, BigDecimal totalBudget) {
//        BigDecimal totalExpenses = expenseRepository.calculateTotalExpenses(tripId);
//        BigDecimal remaining = totalBudget != null ?
//                totalBudget.subtract(totalExpenses) : BigDecimal.ZERO;
//
//        // Get expenses by category
//        List<Object[]> categoryResults = expenseRepository.calculateExpensesByCategory(tripId);
//        Map<String, BigDecimal> byCategory = new HashMap<>();
//        for (Object[] result : categoryResults) {
//            byCategory.put(result[0].toString(), (BigDecimal) result[1]);
//        }
//
//        return ExpenseSummaryDTO.builder()
//                .totalExpenses(totalExpenses)
//                .totalBudget(totalBudget)
//                .remainingBudget(remaining)
//                .expensesByCategory(byCategory)
//                .build();
//    }

}
