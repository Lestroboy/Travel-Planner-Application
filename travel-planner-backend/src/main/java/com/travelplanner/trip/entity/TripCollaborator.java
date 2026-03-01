package com.travelplanner.trip.entity;


import com.travelplanner.auth.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Trip_Collaborator",
        uniqueConstraints = @UniqueConstraint(columnNames = {"trip_id", "user_id"}))
public class TripCollaborator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long collaborationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "collaboration_role")
    private CollaborationRole role = CollaborationRole.VISITOR;

    @Column(name = "invited_At")
    private LocalDateTime invitedAt = LocalDateTime.now();

    @Column(name = "accepted_At")
    private LocalDateTime acceptedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "collaboration_status")
    private CollaborationStatus status = CollaborationStatus.PENDING;

}
