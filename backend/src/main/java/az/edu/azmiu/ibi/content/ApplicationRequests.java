package az.edu.azmiu.ibi.content;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class ApplicationRequests {
    private ApplicationRequests() {}

    public record Program(
            @NotBlank @Size(max = 255) String fullName,
            @NotBlank @Email @Size(max = 255) String email,
            @NotBlank @Size(min = 7, max = 255) String phone,
            @NotBlank @Size(max = 255) String selectedProgram,
            @NotBlank @Size(max = 255) String faculty) {}

    public record Event(
            @NotBlank @Size(max = 255) String fullName,
            @NotBlank @Email @Size(max = 255) String email,
            @NotBlank @Size(min = 7, max = 255) String phone,
            @NotBlank @Size(max = 255) String eventTitle,
            @NotBlank @Pattern(regexp = "in-person|online") String format) {}

    public record Mentor(
            @NotBlank @Size(max = 255) String fullName,
            @NotBlank @Email @Size(max = 255) String email,
            @NotBlank @Size(min = 7, max = 255) String phone,
            @NotBlank @Size(max = 255) String companyRole,
            @NotBlank @Pattern(regexp = "it|marketing|business|design|finance") String expertise,
            @NotBlank @Size(max = 2048) @Pattern(regexp = "https?://.+") String linkedin,
            @NotBlank @Size(max = 5000) String bio) {}

    public record Startup(
            @NotBlank @Size(max = 255) String fullName,
            @NotBlank @Email @Size(max = 255) String email,
            @NotBlank @Size(min = 7, max = 255) String phone,
            @NotBlank @Size(max = 255) String startupTitle,
            @NotBlank @Pattern(regexp = "idea|mvp|sales") String stage,
            @NotBlank @Size(max = 5000) String description) {}
}
