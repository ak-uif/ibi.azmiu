package az.edu.azmiu.ibi.content;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import az.edu.azmiu.ibi.activity.AdminActivityService;
import az.edu.azmiu.ibi.model.ApplicationEntity;
import az.edu.azmiu.ibi.model.EventRegistration;
import az.edu.azmiu.ibi.model.MentorApplication;
import az.edu.azmiu.ibi.model.ProgramApplication;
import az.edu.azmiu.ibi.model.StartupApplication;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminApplicationService {
    private static final Set<String> TYPES = Set.of("program", "event", "mentor", "startup");
    private static final Set<String> STATUSES = Set.of("NEW", "REVIEWING", "ACCEPTED", "REJECTED", "ARCHIVED");
    private static final String ROWS = """
            WITH applications AS (
                SELECT 'program' AS type, id, full_name, email, phone, selected_program AS title,
                       faculty AS secondary, NULL::text AS tertiary, NULL::text AS description,
                       status, created_at, updated_at, FALSE AS has_cv FROM program_applications
                UNION ALL
                SELECT 'event', id, full_name, email, phone, event_title, format, NULL::text,
                       NULL::text, status, created_at, updated_at, FALSE FROM event_registrations
                UNION ALL
                SELECT 'mentor', id, full_name, email, phone, company_role, expertise, linkedin,
                       bio, status, created_at, updated_at, cv_storage_key IS NOT NULL FROM mentor_applications
                UNION ALL
                SELECT 'startup', id, full_name, email, phone, startup_title, stage, NULL::text,
                       description, status, created_at, updated_at, FALSE FROM startup_applications
            )
            """;
    private static final String FILTER = """
            WHERE (:type = 'all' OR type = :type)
              AND (:status = 'ALL' OR status = :status)
              AND (:search = '' OR strpos(lower(concat_ws(' ', full_name, email, phone,
                   title, secondary, tertiary, description)), :search) > 0)
            """;

    private final NamedParameterJdbcTemplate jdbc;
    private final ProgramApplicationRepository programs;
    private final EventRegistrationRepository events;
    private final MentorApplicationRepository mentors;
    private final StartupApplicationRepository startups;
    private final AdminActivityService activity;

    public AdminApplicationService(NamedParameterJdbcTemplate jdbc, ProgramApplicationRepository programs,
            EventRegistrationRepository events, MentorApplicationRepository mentors,
            StartupApplicationRepository startups, AdminActivityService activity) {
        this.jdbc = jdbc;
        this.programs = programs;
        this.events = events;
        this.mentors = mentors;
        this.startups = startups;
        this.activity = activity;
    }

    public Query filters(String type, String status, String search, String sort, String page, String size) {
        String safeType = type == null || type.isBlank() ? "all" : type.trim().toLowerCase(Locale.ROOT);
        String safeStatus = status == null || status.isBlank() ? "ALL" : status.trim().toUpperCase(Locale.ROOT);
        String safeSort = sort == null || sort.isBlank() ? "newest" : sort.trim().toLowerCase(Locale.ROOT);
        String safeSearch = search == null ? "" : search.trim();
        if (!safeType.equals("all") && !TYPES.contains(safeType)) throw new InvalidContentException("Invalid application type");
        if (!safeStatus.equals("ALL") && !STATUSES.contains(safeStatus)) throw new InvalidContentException("Invalid application status");
        if (!safeSort.equals("newest") && !safeSort.equals("oldest")) throw new InvalidContentException("Invalid sort order");
        if (safeSearch.length() > 200) throw new InvalidContentException("Search is too long");
        int pageNumber = number(page, "page", 0, 100000);
        int pageSize = number(size, "size", 1, 100);
        return new Query(safeType, safeStatus, safeSearch.toLowerCase(Locale.ROOT), safeSort, pageNumber, pageSize);
    }

    private static int number(String text, String field, int min, int max) {
        try {
            int value = Integer.parseInt(text);
            if (value >= min && value <= max) return value;
        } catch (NumberFormatException ignored) { }
        throw new InvalidContentException(field + " must be between " + min + " and " + max);
    }

    public PageResult list(Query query) {
        MapSqlParameterSource params = parameters(query);
        Long total = jdbc.queryForObject(ROWS + "SELECT count(*) FROM applications " + FILTER, params, Long.class);
        params.addValue("limit", query.size()).addValue("offset", (long) query.page() * query.size());
        List<Summary> items = jdbc.query(ROWS + "SELECT type, id, full_name, title, status, created_at, has_cv FROM applications "
                + FILTER + order(query) + " LIMIT :limit OFFSET :offset", params, (rs, row) ->
                new Summary(rs.getString("type"), rs.getLong("id"), rs.getString("full_name"),
                        rs.getString("title"), rs.getString("status"), rs.getTimestamp("created_at").toInstant(),
                        rs.getBoolean("has_cv")));
        long count = total == null ? 0 : total;
        return new PageResult(items, count, query.page(), query.size(), (count + query.size() - 1) / query.size());
    }

    public Map<String, Object> detail(String type, Long id) {
        ApplicationEntity entity = find(type, id);
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("type", type);
        data.put("id", entity.getId());
        data.put("fullName", entity.getFullName());
        data.put("email", entity.getEmail());
        data.put("phone", entity.getPhone());
        data.put("status", entity.getStatus());
        data.put("createdAt", entity.getCreatedAt());
        data.put("updatedAt", entity.getUpdatedAt());
        switch (entity) {
            case ProgramApplication item -> {
                data.put("selectedProgram", item.getSelectedProgram());
                data.put("faculty", item.getFaculty());
            }
            case EventRegistration item -> {
                data.put("eventTitle", item.getEventTitle());
                data.put("format", item.getFormat());
            }
            case MentorApplication item -> {
                data.put("companyRole", item.getCompanyRole());
                data.put("expertise", item.getExpertise());
                data.put("linkedin", item.getLinkedin());
                data.put("bio", item.getBio());
                data.put("hasCv", item.getCvStorageKey() != null);
                if (item.getCvStorageKey() != null) {
                    String key = item.getCvStorageKey();
                    String format = key.substring(key.lastIndexOf('.') + 1).toUpperCase(Locale.ROOT);
                    data.put("cvFormat", Set.of("PDF", "DOC", "DOCX").contains(format) ? format : null);
                }
            }
            case StartupApplication item -> {
                data.put("startupTitle", item.getStartupTitle());
                data.put("stage", item.getStage());
                data.put("description", item.getDescription());
            }
            default -> throw new IllegalStateException("Unknown application model");
        }
        return data;
    }

    @Transactional
    public Map<String, Object> updateStatus(String type, Long id, String status) {
        if (status == null || !STATUSES.contains(status)) throw new InvalidContentException("Invalid application status");
        ApplicationEntity entity = find(type, id);
        if (status.equals(entity.getStatus())) return detail(type, id);
        entity.setStatus(status);
        switch (type) {
            case "program" -> programs.saveAndFlush((ProgramApplication) entity);
            case "event" -> events.saveAndFlush((EventRegistration) entity);
            case "mentor" -> mentors.saveAndFlush((MentorApplication) entity);
            case "startup" -> startups.saveAndFlush((StartupApplication) entity);
            default -> throw new InvalidContentException("Invalid application type");
        }
        activity.recordChange("APPLICATION_STATUS_CHANGED", applicationType(type), id, status);
        return detail(type, id);
    }

    public String csv(Query query) {
        MapSqlParameterSource params = parameters(query);
        StringBuilder output = new StringBuilder("\uFEFFType,ID,Full name,Email,Phone,Program,Faculty,Event,Format,Company role,Expertise,LinkedIn,Bio,Startup,Stage,Description,Status,Submitted at,CV attached\r\n");
        jdbc.query(ROWS + "SELECT * FROM applications " + FILTER + order(query), params, rs -> {
            String type = rs.getString("type");
            String title = rs.getString("title");
            String secondary = rs.getString("secondary");
            String tertiary = rs.getString("tertiary");
            String description = rs.getString("description");
            String[] cells = {type, String.valueOf(rs.getLong("id")), rs.getString("full_name"),
                    rs.getString("email"), rs.getString("phone"),
                    type.equals("program") ? title : "", type.equals("program") ? secondary : "",
                    type.equals("event") ? title : "", type.equals("event") ? secondary : "",
                    type.equals("mentor") ? title : "", type.equals("mentor") ? secondary : "",
                    type.equals("mentor") ? tertiary : "", type.equals("mentor") ? description : "",
                    type.equals("startup") ? title : "", type.equals("startup") ? secondary : "",
                    type.equals("startup") ? description : "", rs.getString("status"),
                    rs.getTimestamp("created_at").toInstant().toString(),
                    rs.getBoolean("has_cv") ? "yes" : "no"};
            for (int i = 0; i < cells.length; i++) {
                if (i > 0) output.append(',');
                output.append(csvCell(cells[i]));
            }
            output.append("\r\n");
        });
        return output.toString();
    }

    static String csvCell(String value) {
        String safe = value == null ? "" : value;
        String leading = safe.stripLeading();
        if (!leading.isEmpty() && "=+-@".indexOf(leading.charAt(0)) >= 0) safe = "'" + safe;
        return "\"" + safe.replace("\"", "\"\"") + "\"";
    }

    private ApplicationEntity find(String type, Long id) {
        if (!TYPES.contains(type)) throw new InvalidContentException("Invalid application type");
        if (id == null || id < 1) throw new InvalidContentException("Invalid application ID");
        return switch (type) {
            case "program" -> programs.findById(id).orElseThrow(() -> new RecordNotFoundException("Application"));
            case "event" -> events.findById(id).orElseThrow(() -> new RecordNotFoundException("Application"));
            case "mentor" -> mentors.findById(id).orElseThrow(() -> new RecordNotFoundException("Application"));
            case "startup" -> startups.findById(id).orElseThrow(() -> new RecordNotFoundException("Application"));
            default -> throw new InvalidContentException("Invalid application type");
        };
    }

    public static String applicationType(String type) {
        return switch (type) {
            case "program", "mentor", "startup" -> type + "_application";
            case "event" -> "event_registration";
            default -> throw new InvalidContentException("Invalid application type");
        };
    }

    private static MapSqlParameterSource parameters(Query query) {
        return new MapSqlParameterSource().addValue("type", query.type()).addValue("status", query.status())
                .addValue("search", query.search());
    }

    private static String order(Query query) {
        return query.sort().equals("oldest")
                ? " ORDER BY created_at ASC, type ASC, id ASC"
                : " ORDER BY created_at DESC, type DESC, id DESC";
    }

    public record Query(String type, String status, String search, String sort, int page, int size) {}
    public record Summary(String type, Long id, String fullName, String title, String status,
            Instant createdAt, boolean hasCv) {}
    public record PageResult(List<Summary> items, long total, int page, int size, long totalPages) {}
}
