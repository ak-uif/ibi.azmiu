package az.edu.azmiu.ibi.content;

import java.util.List;

import az.edu.azmiu.ibi.content.ContentDtos.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicContentController {
    private final ProgramRepository programs;
    private final EventRepository events;
    private final NewsRepository news;
    private final MentorRepository mentors;
    private final StartupRepository startups;
    private final PartnerRepository partners;

    public PublicContentController(ProgramRepository programs, EventRepository events,
            NewsRepository news, MentorRepository mentors, StartupRepository startups,
            PartnerRepository partners) {
        this.programs = programs;
        this.events = events;
        this.news = news;
        this.mentors = mentors;
        this.startups = startups;
        this.partners = partners;
    }

    @GetMapping("/programs")
    public List<ProgramResponse> programs() {
        return programs.findPublicPrograms().stream()
                .map(item -> ContentMapper.response(item, ProgramResponse.class)).toList();
    }

    @GetMapping("/events")
    public List<EventResponse> events() {
        return events.findByPublishedTrueOrderByIdAsc().stream()
                .map(item -> ContentMapper.response(item, EventResponse.class)).toList();
    }

    @GetMapping("/news")
    public List<NewsResponse> news() {
        return news.findByPublishedTrueOrderByIdAsc().stream()
                .map(item -> ContentMapper.response(item, NewsResponse.class)).toList();
    }

    @GetMapping("/mentors")
    public List<MentorResponse> mentors() {
        return mentors.findByPublishedTrueOrderByIdAsc().stream()
                .map(item -> ContentMapper.response(item, MentorResponse.class)).toList();
    }

    @GetMapping("/startups")
    public List<StartupResponse> startups() {
        return startups.findByPublishedTrueOrderByIdAsc().stream()
                .map(item -> ContentMapper.response(item, StartupResponse.class)).toList();
    }

    @GetMapping("/partners")
    public List<PartnerResponse> partners() {
        return partners.findByPublishedTrueOrderByIdAsc().stream()
                .map(item -> ContentMapper.response(item, PartnerResponse.class)).toList();
    }
}
