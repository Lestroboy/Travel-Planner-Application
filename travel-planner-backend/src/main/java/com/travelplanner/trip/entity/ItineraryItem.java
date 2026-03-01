package com.travelplanner.trip.entity;

import com.travelplanner.trip.entity.BookingStatus;
import com.travelplanner.trip.entity.ItemType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "itinerary_items")
@EntityListeners(AuditingEntityListener.class)
public class ItineraryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type")
    private ItemType itemType;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date_time")
    private LocalDateTime startDatetime;

    @Column(name = "end_date_time")
    private LocalDateTime endDatetime;

    // TODO : think about it if needed then use else remove these 3 properties
    @Column(length = 255)
    private String location;

    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "booking_reference", length = 100)
    private String bookingReference;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status")
    private BookingStatus bookingStatus = BookingStatus.PENDING;

    @Column(precision = 10, scale = 2)
    private BigDecimal cost;

    @Column(length = 3)
    private String currency = "INR";

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "sequence_order")
    private Integer sequenceOrder = 0;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "itineraryItem", cascade = CascadeType.ALL)
    private Flight flight;

    @OneToOne(mappedBy = "itineraryItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private Accommodation accommodation;

    @OneToOne(mappedBy = "itineraryItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private Activity activity;

}
