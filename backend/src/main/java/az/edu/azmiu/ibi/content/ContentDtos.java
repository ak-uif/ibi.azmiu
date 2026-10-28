package az.edu.azmiu.ibi.content;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public final class ContentDtos {

    private ContentDtos() {
    }

    public record ProgramRequest(
            @Size(max = 255) String category,
            @NotBlank @Size(max = 255) String status,
            @NotBlank @Size(max = 255) String titleAz,
            @Size(max = 255) String titleEn,
            @NotBlank String descriptionAz,
            String descriptionEn,
            String detailsAz,
            String detailsEn,
            @Size(max = 255) String durationAz,
            @Size(max = 255) String durationEn,
            @Size(max = 255) String audienceAz,
            @Size(max = 255) String audienceEn,
            @Size(max = 255) String deadlineAz,
            @Size(max = 255) String deadlineEn,
            @Size(max = 255) String periodAz,
            @Size(max = 255) String periodEn,
            @Size(max = 255) String icon) {
    }

    public record ProgramResponse(
            Long id,
            String category,
            String status,
            String titleAz,
            String titleEn,
            String descriptionAz,
            String descriptionEn,
            String detailsAz,
            String detailsEn,
            String durationAz,
            String durationEn,
            String audienceAz,
            String audienceEn,
            String deadlineAz,
            String deadlineEn,
            String periodAz,
            String periodEn,
            String icon,
            Instant createdAt,
            Instant updatedAt) {
    }

    public record EventRequest(
            @Size(max = 255) String dayLabel,
            @Size(max = 255) String monthAz,
            @Size(max = 255) String monthEn,
            @NotBlank @Size(max = 255) String titleAz,
            @Size(max = 255) String titleEn,
            @Size(max = 255) String locationAz,
            @Size(max = 255) String locationEn,
            @Size(max = 255) String timeAz,
            @Size(max = 255) String timeEn,
            @Size(max = 255) String attendees,
            @Size(max = 255) String speakerAz,
            @Size(max = 255) String speakerEn,
            @NotBlank String descriptionAz,
            String descriptionEn,
            String detailsAz,
            String detailsEn,
            Boolean published) {
    }

    public record EventResponse(
            Long id,
            String dayLabel,
            String monthAz,
            String monthEn,
            String titleAz,
            String titleEn,
            String locationAz,
            String locationEn,
            String timeAz,
            String timeEn,
            String attendees,
            String speakerAz,
            String speakerEn,
            String descriptionAz,
            String descriptionEn,
            String detailsAz,
            String detailsEn,
            boolean published,
            Instant createdAt,
            Instant updatedAt) {
    }

    public record NewsRequest(
            @Size(max = 255) String categoryAz,
            @Size(max = 255) String categoryEn,
            @Size(max = 255) String dateAz,
            @Size(max = 255) String dateEn,
            @NotBlank @Size(max = 255) String titleAz,
            @Size(max = 255) String titleEn,
            String summaryAz,
            String summaryEn,
            String fullTextAz,
            String fullTextEn,
            @Size(max = 2048) String imageUrl,
            Boolean published) {
    }

    public record NewsResponse(
            Long id,
            String categoryAz,
            String categoryEn,
            String dateAz,
            String dateEn,
            String titleAz,
            String titleEn,
            String summaryAz,
            String summaryEn,
            String fullTextAz,
            String fullTextEn,
            String imageUrl,
            boolean published,
            Instant createdAt,
            Instant updatedAt) {
    }

    public record MentorRequest(
            @NotBlank @Size(max = 255) String name,
            @Size(max = 255) String roleAz,
            @Size(max = 255) String roleEn,
            @Size(max = 255) String category,
            List<String> skills,
            @Size(max = 2048) String avatarUrl,
            @Size(max = 2048) String linkedinUrl,
            @Size(max = 2048) String githubUrl,
            Boolean published) {
    }

    public record MentorResponse(
            Long id,
            String name,
            String roleAz,
            String roleEn,
            String category,
            List<String> skills,
            String avatarUrl,
            String linkedinUrl,
            String githubUrl,
            boolean published,
            Instant createdAt,
            Instant updatedAt) {
    }

    public record StartupRequest(
            @NotBlank @Size(max = 255) String name,
            @Size(max = 255) String logoText,
            @Size(max = 255) String logoColor,
            @Size(max = 255) String taglineAz,
            @Size(max = 255) String taglineEn,
            @Size(max = 255) String stageAz,
            @Size(max = 255) String stageEn,
            @PositiveOrZero Integer members,
            @NotBlank String descriptionAz,
            String descriptionEn,
            List<Map<String, Object>> founders,
            List<String> techStack,
            String tractionAz,
            String tractionEn,
            @Size(max = 2048) String website,
            Boolean published) {
    }

    public record StartupResponse(
            Long id,
            String name,
            String logoText,
            String logoColor,
            String taglineAz,
            String taglineEn,
            String stageAz,
            String stageEn,
            Integer members,
            String descriptionAz,
            String descriptionEn,
            List<Map<String, Object>> founders,
            List<String> techStack,
            String tractionAz,
            String tractionEn,
            String website,
            boolean published,
            Instant createdAt,
            Instant updatedAt) {
    }

    public record PartnerRequest(
            @NotBlank @Size(max = 255) String name,
            @Size(max = 255) String icon,
            Boolean published) {
    }

    public record PartnerResponse(
            Long id,
            String name,
            String icon,
            boolean published,
            Instant createdAt,
            Instant updatedAt) {
    }

}
