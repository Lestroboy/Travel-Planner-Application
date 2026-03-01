package com.travelplanner.trip.dto.response;

import com.travelplanner.trip.entity.CollaborationRole;
import com.travelplanner.trip.entity.CollaborationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollaboratorDTO {
    private Long collaborationId;
    private Long userId;
    private String email;
    private String fullName;
    private String profilePictureUrl;
    private CollaborationRole role;
    private CollaborationStatus status;
    private LocalDateTime invitedAt;
    private LocalDateTime acceptedAt;
}