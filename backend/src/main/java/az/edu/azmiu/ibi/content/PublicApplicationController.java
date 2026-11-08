package az.edu.azmiu.ibi.content;

import az.edu.azmiu.ibi.model.ApplicationEntity;
import az.edu.azmiu.ibi.model.EventRegistration;
import az.edu.azmiu.ibi.model.MentorApplication;
import az.edu.azmiu.ibi.model.ProgramApplication;
import az.edu.azmiu.ibi.model.StartupApplication;
import jakarta.validation.Valid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/public/applications")
public class PublicApplicationController {
    private final ProgramApplicationRepository programs;
    private final EventRegistrationRepository events;
    private final MentorApplicationRepository mentors;
    private final StartupApplicationRepository startups;
    private final MentorCvStorage cvStorage;

    public PublicApplicationController(ProgramApplicationRepository programs, EventRegistrationRepository events,
            MentorApplicationRepository mentors, StartupApplicationRepository startups, MentorCvStorage cvStorage) {
        this.programs = programs;
        this.events = events;
        this.mentors = mentors;
        this.startups = startups;
        this.cvStorage = cvStorage;
    }

    @PostMapping("/programs")
    @ResponseStatus(HttpStatus.CREATED)
    public SubmissionResponse program(@Valid @RequestBody ApplicationRequests.Program request) {
        rejectHoneypot(request.websiteConfirm());
        ProgramApplication entity = common(new ProgramApplication(), request.fullName(), request.email(), request.phone());
        entity.setSelectedProgram(request.selectedProgram().trim());
        entity.setFaculty(request.faculty().trim());
        return saved(programs, entity);
    }

    @PostMapping("/events")
    @ResponseStatus(HttpStatus.CREATED)
    public SubmissionResponse event(@Valid @RequestBody ApplicationRequests.Event request) {
        rejectHoneypot(request.websiteConfirm());
        EventRegistration entity = common(new EventRegistration(), request.fullName(), request.email(), request.phone());
        entity.setEventTitle(request.eventTitle().trim());
        entity.setFormat(request.format());
        return saved(events, entity);
    }

    @PostMapping(value = "/mentors", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public SubmissionResponse mentor(@Valid @RequestBody ApplicationRequests.Mentor request) {
        rejectHoneypot(request.websiteConfirm());
        return saved(mentors, mentorEntity(request));
    }

    @PostMapping(value = "/mentors", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public SubmissionResponse mentorMultipart(@Valid @RequestPart("application") ApplicationRequests.Mentor request,
            @RequestPart(value = "cv", required = false) MultipartFile cv) {
        rejectHoneypot(request.websiteConfirm());
        MentorApplication entity = mentorEntity(request);
        String key = cv == null ? null : cvStorage.store(cv);
        entity.setCvStorageKey(key);
        try {
            return saved(mentors, entity);
        } catch (RuntimeException exception) {
            cvStorage.delete(key);
            throw exception;
        }
    }

    @PostMapping("/startups")
    @ResponseStatus(HttpStatus.CREATED)
    public SubmissionResponse startup(@Valid @RequestBody ApplicationRequests.Startup request) {
        rejectHoneypot(request.websiteConfirm());
        StartupApplication entity = common(new StartupApplication(), request.fullName(), request.email(), request.phone());
        entity.setStartupTitle(request.startupTitle().trim());
        entity.setStage(request.stage());
        entity.setDescription(request.description().trim());
        return saved(startups, entity);
    }

    private static <T extends ApplicationEntity> T common(T entity, String fullName, String email, String phone) {
        entity.setFullName(fullName.trim());
        entity.setEmail(email.trim());
        entity.setPhone(phone.trim());
        return entity;
    }

    private static void rejectHoneypot(String value) {
        if (value != null && !value.isBlank()) throw new SpamDetectedException();
    }

    private static MentorApplication mentorEntity(ApplicationRequests.Mentor request) {
        MentorApplication entity = common(new MentorApplication(), request.fullName(), request.email(), request.phone());
        entity.setCompanyRole(request.companyRole().trim());
        entity.setExpertise(request.expertise());
        entity.setLinkedin(request.linkedin().trim());
        entity.setBio(request.bio().trim());
        return entity;
    }

    private static <T extends ApplicationEntity> SubmissionResponse saved(JpaRepository<T, Long> repository, T entity) {
        repository.saveAndFlush(entity);
        return new SubmissionResponse("submitted");
    }

    public record SubmissionResponse(String status) {}
}
