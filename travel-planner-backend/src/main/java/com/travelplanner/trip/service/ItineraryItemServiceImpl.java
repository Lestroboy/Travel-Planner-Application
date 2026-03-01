package com.travelplanner.trip.service;

import com.travelplanner.trip.dto.request.*;
import com.travelplanner.trip.dto.response.*;
import com.travelplanner.trip.entity.*;
import com.travelplanner.trip.entity.BookingStatus;
import com.travelplanner.trip.entity.ItemType;

import com.travelplanner.exception.UnauthorizedException;
import com.travelplanner.trip.exception.BadRequestException;
import com.travelplanner.trip.exception.ResourceNotFoundException;
import com.travelplanner.trip.repository.*;
import com.travelplanner.trip.service.ItineraryItemService;
import com.travelplanner.security.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItineraryItemServiceImpl implements ItineraryItemService {

    private final ItineraryItemRepository itemRepository;
    private final TripRepository tripRepository;
    private final TripCollaboratorRepository collaboratorRepository;
    private final FlightRepository flightRepository;
    private final AccommodationRepository accommodationRepository;
    private final ActivityRepository activityRepository;
    private final SecurityUtil securityUtil;

    @Override
    @Transactional
    public ItineraryItemDTO createItem(Long tripId, CreateItineraryItemRequest request) {
        Trip trip = getTripWithEditPermission(tripId);

        // Get next sequence order
        Integer maxOrder = itemRepository.findMaxSequenceOrder(tripId);
        Integer nextOrder = maxOrder + 1;

        // Create itinerary item
        ItineraryItem item = new ItineraryItem();
        item.setTrip(trip);
        item.setItemType(ItemType.valueOf(request.getItemType().toUpperCase()));
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setStartDatetime(request.getStartDatetime());
        item.setEndDatetime(request.getEndDatetime());
        item.setLocation(request.getLocation());
        item.setLatitude(request.getLatitude());
        item.setLongitude(request.getLongitude());
        item.setBookingReference(request.getBookingReference());

        if (request.getBookingStatus() != null) {
            item.setBookingStatus(BookingStatus.valueOf(request.getBookingStatus().toUpperCase()));
        } else {
            item.setBookingStatus(BookingStatus.PENDING);
        }

        item.setCost(request.getCost());
        item.setCurrency(request.getCurrency());
        item.setNotes(request.getNotes());
        item.setSequenceOrder(nextOrder);

        item = itemRepository.save(item);

        return convertToDTO(item);
    }

    @Override
    @Transactional
    public ItineraryItemDTO updateItem(Long tripId, Long itemId, UpdateItineraryItemRequest request) {
        getTripWithEditPermission(tripId);

        ItineraryItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary item not found"));

        // Verify item belongs to trip
        if (!item.getTrip().getTripId().equals(tripId)) {
            throw new BadRequestException("Item does not belong to this trip");
        }

        // Update fields if provided
        if (request.getTitle() != null) {
            item.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            item.setDescription(request.getDescription());
        }
        if (request.getStartDatetime() != null) {
            item.setStartDatetime(request.getStartDatetime());
        }
        if (request.getEndDatetime() != null) {
            item.setEndDatetime(request.getEndDatetime());
        }
        if (request.getLocation() != null) {
            item.setLocation(request.getLocation());
        }
        if (request.getLatitude() != null) {
            item.setLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            item.setLongitude(request.getLongitude());
        }
        if (request.getBookingReference() != null) {
            item.setBookingReference(request.getBookingReference());
        }
        if (request.getBookingStatus() != null) {
            item.setBookingStatus(BookingStatus.valueOf(request.getBookingStatus().toUpperCase()));
        }
        if (request.getCost() != null) {
            item.setCost(request.getCost());
        }
        if (request.getCurrency() != null) {
            item.setCurrency(request.getCurrency());
        }
        if (request.getNotes() != null) {
            item.setNotes(request.getNotes());
        }

        item = itemRepository.save(item);
        return convertToDTO(item);
    }

    @Override
    @Transactional
    public void deleteItem(Long tripId, Long itemId) {
        getTripWithEditPermission(tripId);

        ItineraryItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary item not found"));

        // Verify item belongs to trip
        if (!item.getTrip().getTripId().equals(tripId)) {
            throw new BadRequestException("Item does not belong to this trip");
        }

        itemRepository.delete(item);
    }

    @Override
    @Transactional(readOnly = true)
    public ItineraryItemDTO getItemById(Long tripId, Long itemId) {
        getTripWithAccessCheck(tripId);

        ItineraryItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Itinerary item not found"));

        // Verify item belongs to trip
        if (!item.getTrip().getTripId().equals(tripId)) {
            throw new BadRequestException("Item does not belong to this trip");
        }

        return convertToDTO(item);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItineraryItemDTO> getAllItems(Long tripId) {
        getTripWithAccessCheck(tripId);

        List<ItineraryItem> items = itemRepository.findByTripTripIdOrderBySequenceOrderAsc(tripId);
        return items.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ItineraryItemDTO createFlight(Long tripId, CreateItineraryItemRequest itemRequest, CreateFlightRequest flightRequest) {
        // Validate item type
        if (!ItemType.FLIGHT.name().equals(itemRequest.getItemType().toUpperCase())) {
            throw new BadRequestException("Item type must be FLIGHT");
        }

        // Create itinerary item
        ItineraryItemDTO itemDTO = createItem(tripId, itemRequest);

        // Create flight details
        ItineraryItem item = itemRepository.findById(itemDTO.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        Flight flight = new Flight();
        flight.setItineraryItem(item);
        flight.setFlightNumber(flightRequest.getFlightNumber());
        flight.setAirLine(flightRequest.getAirline());
        flight.setDepartedAirport(flightRequest.getDepartureAirport());
        flight.setArrivalAirport(flightRequest.getArrivalAirport());
        flight.setDepartureTime(flightRequest.getDepartureTime());
        flight.setArrivalTime(flightRequest.getArrivalTime());
        flight.setBookingClass(flightRequest.getBookingClass());
        flight.setSeatNumber(flightRequest.getSeatNumber());
        flight.setPnrNumber(flightRequest.getPnrNumber());
        flight.setExternalBookingId(flightRequest.getExternalBookingId());

        flightRepository.save(flight);

        // Reload item with flight details
        item = itemRepository.findById(itemDTO.getItemId()).get();
        return convertToDTO(item);
    }

    @Override
    @Transactional
    public ItineraryItemDTO createAccommodation(Long tripId, CreateItineraryItemRequest itemRequest, CreateAccommodationRequest accommodationRequest) {
        // Validate item type
        if (!ItemType.ACCOMMODATION.name().equals(itemRequest.getItemType().toUpperCase())) {
            throw new BadRequestException("Item type must be ACCOMMODATION");
        }

        // Create itinerary item
        ItineraryItemDTO itemDTO = createItem(tripId, itemRequest);

        // Create accommodation details
        ItineraryItem item = itemRepository.findById(itemDTO.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        Accommodation accommodation = new Accommodation();
        accommodation.setItineraryItem(item);
        accommodation.setHotelName(accommodationRequest.getHotelName());
        accommodation.setAddress(accommodationRequest.getAddress());
        accommodation.setCheckIn(accommodationRequest.getCheckIn());
        accommodation.setCheckOut(accommodationRequest.getCheckOut());
        accommodation.setRoomType(accommodationRequest.getRoomType());
        accommodation.setConfirmationNumber(accommodationRequest.getConfirmationNumber());
        accommodation.setExternalBookingId(accommodationRequest.getExternalBookingId());

        accommodationRepository.save(accommodation);

        // Reload item with accommodation details
        item = itemRepository.findById(itemDTO.getItemId()).get();
        return convertToDTO(item);
    }

    @Override
    @Transactional
    public ItineraryItemDTO createActivity(Long tripId, CreateItineraryItemRequest itemRequest, CreateActivityRequest activityRequest) {
        // Validate item type
        if (!ItemType.ACTIVITY.name().equals(itemRequest.getItemType().toUpperCase())) {
            throw new BadRequestException("Item type must be ACTIVITY");
        }

        // Create itinerary item
        ItineraryItemDTO itemDTO = createItem(tripId, itemRequest);

        // Create activity details
        ItineraryItem item = itemRepository.findById(itemDTO.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        Activity activity = new Activity();
        activity.setItineraryItem(item);
        activity.setActivityName(activityRequest.getActivityName());
        activity.setCategory(activityRequest.getCategory());
        activity.setPoiId(activityRequest.getPoiId());
        activity.setRating(activityRequest.getRating());
        activity.setPriceLevel(activityRequest.getPriceLevel());
        activity.setWebsite(activityRequest.getWebsite());
        activity.setPhone(activityRequest.getPhone());

        activityRepository.save(activity);

        // Reload item with activity details
        item = itemRepository.findById(itemDTO.getItemId()).get();
        return convertToDTO(item);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItineraryItemDTO> getItemsByType(Long tripId, String itemType) {
        getTripWithAccessCheck(tripId);

        ItemType type = ItemType.valueOf(itemType.toUpperCase());
        List<ItineraryItem> items = itemRepository.findByTripTripIdAndItemType(tripId, type);

        return items.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ItineraryItemDTO> getItemsByDateRange(Long tripId, LocalDate startDate, LocalDate endDate) {
        getTripWithAccessCheck(tripId);

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        List<ItineraryItem> items = itemRepository.findItemsInDateRange(tripId, startDateTime, endDateTime);

        return items.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void reorderItems(Long tripId, ReorderItemsRequest request) {
        getTripWithEditPermission(tripId);

        // Validate all items belong to the trip
        List<Long> itemIds = request.getItemIds();
        List<ItineraryItem> items = itemRepository.findAllById(itemIds);

        if (items.size() != itemIds.size()) {
            throw new BadRequestException("Some items not found");
        }

        for (ItineraryItem item : items) {
            if (!item.getTrip().getTripId().equals(tripId)) {
                throw new BadRequestException("All items must belong to the trip");
            }
        }

        // Update sequence order
        for (int i = 0; i < itemIds.size(); i++) {
            Long itemId = itemIds.get(i);
            ItineraryItem item = items.stream()
                    .filter(it -> it.getItemId().equals(itemId))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

            item.setSequenceOrder(i + 1);
            itemRepository.save(item);
        }
    }

    // Helper methods

    private Trip getTripWithAccessCheck(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        Long currentUserId = securityUtil.getCurrentUserId();
        boolean isOwner = trip.getUser().getUserId().equals(currentUserId);
        boolean hasAccess = collaboratorRepository.hasAccess(tripId, currentUserId);

        if (!isOwner && !hasAccess) {
            throw new UnauthorizedException("You don't have access to this trip");
        }

        return trip;
    }

    private Trip getTripWithEditPermission(Long tripId) {
        Trip trip = getTripWithAccessCheck(tripId);

        Long currentUserId = securityUtil.getCurrentUserId();

        // Owner always has edit permission
        if (trip.getUser().getUserId().equals(currentUserId)) {
            return trip;
        }

        // Check if collaborator has EDITOR or OWNER role
        boolean hasEditPermission = collaboratorRepository.findByTripTripIdAndUserUserId(tripId, currentUserId)
                .map(collab -> collab.getRole().name().equals("OWNER") ||
                        collab.getRole().name().equals("EDITOR"))
                .orElse(false);

        if (!hasEditPermission) {
            throw new UnauthorizedException("You don't have permission to edit this trip");
        }

        return trip;
    }

    private ItineraryItemDTO convertToDTO(ItineraryItem item) {
        ItineraryItemDTO dto = ItineraryItemDTO.builder()
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

        // Add type-specific details
        switch (item.getItemType()) {
            case FLIGHT:
                if (item.getFlight() != null) {
                    dto.setDetails(convertFlightToDTO(item.getFlight()));
                }
                break;
            case ACCOMMODATION:
                if (item.getAccommodation() != null) {
                    dto.setDetails(convertAccommodationToDTO(item.getAccommodation()));
                }
                break;
            case ACTIVITY:
                if (item.getActivity() != null) {
                    dto.setDetails(convertActivityToDTO(item.getActivity()));
                }
                break;
            default:
                break;
        }

        return dto;
    }

    private FlightDTO convertFlightToDTO(Flight flight) {
        return FlightDTO.builder()
                .flightId(flight.getFlightId())
                .flightNumber(flight.getFlightNumber())
                .airline(flight.getAirLine())
                .departureAirport(flight.getDepartedAirport())
                .arrivalAirport(flight.getArrivalAirport())
                .departureTime(flight.getDepartureTime())
                .arrivalTime(flight.getArrivalTime())
                .bookingClass(flight.getBookingClass())
                .seatNumber(flight.getSeatNumber())
                .pnrNumber(flight.getPnrNumber())
                .externalBookingId(flight.getExternalBookingId())
                .build();
    }

    private AccommodationDTO convertAccommodationToDTO(Accommodation accommodation) {
        return AccommodationDTO.builder()
                .accommodationId(accommodation.getAccommodationId())
                .hotelName(accommodation.getHotelName())
                .address(accommodation.getAddress())
                .checkIn(accommodation.getCheckIn())
                .checkOut(accommodation.getCheckOut())
                .roomType(accommodation.getRoomType())
                .confirmationNumber(accommodation.getConfirmationNumber())
                .externalBookingId(accommodation.getExternalBookingId())
                .build();
    }

    private ActivityDTO convertActivityToDTO(Activity activity) {
        return ActivityDTO.builder()
                .activityId(activity.getActivityId())
                .activityName(activity.getActivityName())
                .category(activity.getCategory())
                .poiId(activity.getPoiId())
                .rating(activity.getRating())
                .priceLevel(activity.getPriceLevel())
                .website(activity.getWebsite())
                .phone(activity.getPhone())
                .build();
    }
}