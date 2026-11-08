package az.edu.azmiu.ibi.activity;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Set;

import az.edu.azmiu.ibi.content.InvalidContentException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminActivityService {
    public static final Set<String> ACTIONS = Set.of(
            "LOGIN", "LOGOUT", "CONTENT_CREATED", "CONTENT_UPDATED", "CONTENT_PUBLISHED",
            "CONTENT_UNPUBLISHED", "CONTENT_ARCHIVED", "CONTENT_RESTORED", "CONTENT_DELETED",
            "APPLICATION_VIEWED", "APPLICATION_STATUS_CHANGED", "CV_DOWNLOADED", "APPLICATIONS_EXPORTED");
    private static final Set<String> RECORD_TYPES = Set.of(
            "program", "event", "news", "mentor", "startup", "partner",
            "program_application", "event_registration", "mentor_application", "startup_application",
            "applications");

    private final NamedParameterJdbcTemplate jdbc;

    public AdminActivityService(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public void recordChange(String action, String recordType, Long recordId, String detail) {
        insert(actor(), action, recordType, recordId, detail);
    }

    @Transactional
    public void recordSuccess(String action, String recordType, Long recordId, String detail) {
        insert(actor(), action, recordType, recordId, detail);
    }

    @Transactional
    public void recordAuthentication(String username, String action) {
        if (!Set.of("LOGIN", "LOGOUT").contains(action)) throw new IllegalArgumentException("Invalid auth action");
        insert(username, action, null, null, null);
    }

    private void insert(String username, String action, String recordType, Long recordId, String detail) {
        if (username == null || username.isBlank() || username.length() > 255
                || !ACTIONS.contains(action) || (recordType != null && !RECORD_TYPES.contains(recordType))
                || (detail != null && detail.length() > 64)) {
            throw new IllegalArgumentException("Invalid activity entry");
        }
        jdbc.update("""
                INSERT INTO admin_activity_log (admin_username, action, record_type, record_id, detail)
                VALUES (:actor, :action, :type, :id, :detail)
                """, new MapSqlParameterSource().addValue("actor", username).addValue("action", action)
                .addValue("type", recordType).addValue("id", recordId).addValue("detail", detail));
    }

    private static String actor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new IllegalStateException("Admin session required for activity");
        }
        return authentication.getName();
    }

    public Query filters(String action, String admin, String from, String to, String recordType,
            String recordId, String page, String size) {
        String safeAction = action == null ? "" : action.trim().toUpperCase();
        String safeAdmin = admin == null ? "" : admin.trim();
        String safeType = recordType == null ? "" : recordType.trim().toLowerCase();
        if (!safeAction.isEmpty() && !ACTIONS.contains(safeAction)) throw new InvalidContentException("Invalid action");
        if (safeAdmin.length() > 255) throw new InvalidContentException("Admin filter is too long");
        if (!safeType.isEmpty() && !RECORD_TYPES.contains(safeType)) throw new InvalidContentException("Invalid record type");
        Long id = null;
        if (recordId != null && !recordId.isBlank()) {
            try { id = Long.parseLong(recordId); }
            catch (NumberFormatException exception) { throw new InvalidContentException("Invalid record ID"); }
            if (id < 1) throw new InvalidContentException("Invalid record ID");
        }
        Instant start = date(from, false);
        Instant end = date(to, true);
        if (start != null && end != null && !start.isBefore(end)) throw new InvalidContentException("Invalid date range");
        return new Query(safeAction, safeAdmin, start, end, safeType, id,
                number(page, "page", 0, 100000), number(size, "size", 1, 100));
    }

    private static Instant date(String value, boolean nextDay) {
        if (value == null || value.isBlank()) return null;
        try {
            LocalDate day = LocalDate.parse(value);
            return day.plusDays(nextDay ? 1 : 0).atStartOfDay().toInstant(ZoneOffset.UTC);
        } catch (DateTimeParseException exception) {
            throw new InvalidContentException("Date must use YYYY-MM-DD");
        }
    }

    private static int number(String value, String field, int min, int max) {
        try {
            int parsed = Integer.parseInt(value);
            if (parsed >= min && parsed <= max) return parsed;
        } catch (NumberFormatException ignored) { }
        throw new InvalidContentException(field + " must be between " + min + " and " + max);
    }

    @Transactional(readOnly = true)
    public PageResult list(Query query) {
        StringBuilder where = new StringBuilder(" WHERE 1=1");
        MapSqlParameterSource params = new MapSqlParameterSource();
        if (!query.action().isEmpty()) { where.append(" AND action = :action"); params.addValue("action", query.action()); }
        if (!query.admin().isEmpty()) { where.append(" AND admin_username = :admin"); params.addValue("admin", query.admin()); }
        if (query.from() != null) { where.append(" AND created_at >= :from_date"); params.addValue("from_date", Timestamp.from(query.from())); }
        if (query.to() != null) { where.append(" AND created_at < :to_date"); params.addValue("to_date", Timestamp.from(query.to())); }
        if (!query.recordType().isEmpty()) { where.append(" AND record_type = :type"); params.addValue("type", query.recordType()); }
        if (query.recordId() != null) { where.append(" AND record_id = :record_id"); params.addValue("record_id", query.recordId()); }
        Long total = jdbc.queryForObject("SELECT count(*) FROM admin_activity_log " + where, params, Long.class);
        params.addValue("limit", query.size()).addValue("offset", (long) query.page() * query.size());
        List<Entry> items = jdbc.query("""
                SELECT id, admin_username, action, record_type, record_id, detail, created_at
                FROM admin_activity_log
                """ + where + " ORDER BY created_at DESC, id DESC LIMIT :limit OFFSET :offset", params,
                (rs, row) -> new Entry(rs.getLong("id"), rs.getString("admin_username"),
                        rs.getString("action"), rs.getString("record_type"),
                        rs.getObject("record_id", Long.class), rs.getString("detail"),
                        rs.getTimestamp("created_at").toInstant()));
        long count = total == null ? 0 : total;
        return new PageResult(items, count, query.page(), query.size(), (count + query.size() - 1) / query.size());
    }

    public record Query(String action, String admin, Instant from, Instant to, String recordType,
            Long recordId, int page, int size) {}
    public record Entry(long id, String admin, String action, String recordType, Long recordId,
            String detail, Instant createdAt) {}
    public record PageResult(List<Entry> items, long total, int page, int size, long totalPages) {}
}
