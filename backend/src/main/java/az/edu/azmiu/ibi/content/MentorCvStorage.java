package az.edu.azmiu.ibi.content;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Locale;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MentorCvStorage {
    private static final int MAX_BYTES = 5 * 1024 * 1024;
    private final Path root;

    public MentorCvStorage(@Value("${CV_STORAGE_DIR:}") String configured) {
        root = (configured.isBlank()
                ? Path.of(System.getProperty("user.home"), ".ibi-azmiu", "mentor-cvs")
                : Path.of(configured)).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file) {
        if (file.isEmpty()) throw new InvalidUploadException("CV file is empty");
        if (file.getSize() > MAX_BYTES) throw new InvalidUploadException("CV must be 5 MB or smaller");
        String extension = extension(file.getOriginalFilename());
        String expectedType = contentType(extension);
        if (!expectedType.equalsIgnoreCase(file.getContentType())) {
            throw new InvalidUploadException("CV file type does not match its extension");
        }
        byte[] bytes;
        try (InputStream input = file.getInputStream()) {
            bytes = input.readNBytes(MAX_BYTES + 1);
        } catch (IOException exception) {
            throw new InvalidUploadException("CV file could not be read");
        }
        if (bytes.length == 0 || bytes.length > MAX_BYTES) {
            throw new InvalidUploadException("CV must be 5 MB or smaller");
        }
        if (!validContent(extension, bytes)) throw new InvalidUploadException("CV file content is invalid");
        String key = UUID.randomUUID().toString().replace("-", "") + "." + extension;
        try {
            Files.createDirectories(root);
            Files.write(root.resolve(key), bytes, StandardOpenOption.CREATE_NEW);
        } catch (IOException exception) {
            delete(key);
            throw new IllegalStateException("CV storage is unavailable");
        }
        return key;
    }

    public StoredCv read(String key) {
        if (key == null || !key.matches("[0-9a-f]{32}\\.(pdf|doc|docx)")) {
            throw new RecordNotFoundException("CV");
        }
        Path path = root.resolve(key);
        try {
            if (!Files.isRegularFile(path) || Files.size(path) > MAX_BYTES) throw new RecordNotFoundException("CV");
            return new StoredCv(Files.readAllBytes(path), MediaType.parseMediaType(contentType(extension(key))), extension(key));
        } catch (IOException exception) {
            throw new RecordNotFoundException("CV");
        }
    }

    public void delete(String key) {
        if (key == null) return;
        try { Files.deleteIfExists(root.resolve(key)); }
        catch (IOException ignored) { /* Keep the original persistence failure. */ }
    }

    private static String extension(String name) {
        if (name == null || name.lastIndexOf('.') < 0) throw new InvalidUploadException("CV must be PDF, DOC or DOCX");
        String extension = name.substring(name.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT);
        if (!extension.equals("pdf") && !extension.equals("doc") && !extension.equals("docx")) {
            throw new InvalidUploadException("CV must be PDF, DOC or DOCX");
        }
        return extension;
    }

    private static String contentType(String extension) {
        return switch (extension) {
            case "pdf" -> "application/pdf";
            case "doc" -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            default -> throw new InvalidUploadException("CV must be PDF, DOC or DOCX");
        };
    }

    private static boolean validContent(String extension, byte[] bytes) {
        return switch (extension) {
            case "pdf" -> startsWith(bytes, "%PDF-".getBytes(StandardCharsets.US_ASCII))
                    && new String(bytes, Math.max(0, bytes.length - 1024), Math.min(bytes.length, 1024),
                            StandardCharsets.US_ASCII).contains("%%EOF");
            case "doc" -> bytes.length >= 512
                    && startsWith(bytes, new byte[]{(byte) 0xd0, (byte) 0xcf, 0x11, (byte) 0xe0,
                            (byte) 0xa1, (byte) 0xb1, 0x1a, (byte) 0xe1})
                    && bytes[28] == (byte) 0xfe && bytes[29] == (byte) 0xff
                    && (bytes[30] == 9 || bytes[30] == 12) && bytes[31] == 0;
            case "docx" -> validDocx(bytes);
            default -> false;
        };
    }

    private static boolean startsWith(byte[] bytes, byte[] prefix) {
        if (bytes.length < prefix.length) return false;
        for (int i = 0; i < prefix.length; i++) if (bytes[i] != prefix[i]) return false;
        return true;
    }

    private static boolean validDocx(byte[] bytes) {
        if (!startsWith(bytes, new byte[]{'P', 'K', 3, 4})) return false;
        boolean contentTypes = false;
        boolean document = false;
        int expanded = 0;
        int entries = 0;
        try (ZipInputStream zip = new ZipInputStream(new ByteArrayInputStream(bytes))) {
            ZipEntry entry;
            byte[] buffer = new byte[8192];
            while ((entry = zip.getNextEntry()) != null) {
                if (++entries > 2000) return false;
                if (entry.getName().equals("[Content_Types].xml")) contentTypes = true;
                if (entry.getName().equals("word/document.xml")) document = true;
                int read;
                while ((read = zip.read(buffer)) != -1) {
                    expanded += read;
                    if (expanded > 4 * MAX_BYTES) return false;
                }
            }
        } catch (IOException exception) {
            return false;
        }
        return contentTypes && document;
    }

    public record StoredCv(byte[] bytes, MediaType type, String extension) {}
}
