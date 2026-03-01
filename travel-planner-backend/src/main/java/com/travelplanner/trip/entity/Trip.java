package com.travelplanner.trip.entity;


import com.travelplanner.auth.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tripId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "trip_name", nullable = false, length = 100)
    private String tripName;

    @Column(name = "description", nullable = true, length = 200)
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "destination_city", nullable = false, length = 100)
    private String destinationCity;

    @Column(name = "destination_country", nullable = false, length = 100)
    private String destinationCountry;

    @Column(name = "total_budget", precision = 10, scale = 2)
    private BigDecimal totalBudget;

    // TODO : Add multiple currencies
    @Column(name = "currency", length = 3)
    private String currency = "INR";

    @Column(name = "is_group_trip")
    private Boolean isGroupTrip = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "trip_status")
    private TripStatus tripStatus;

//    @Enumerated(EnumType.STRING)
//    private TripVisibility visibility;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItineraryItem> itineraryItem = new ArrayList<>();

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripCollaborator> tripCollaborator = new ArrayList<>();
//
//    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL)
//    private List<Expense> expenses = new ArrayList<>();

}
