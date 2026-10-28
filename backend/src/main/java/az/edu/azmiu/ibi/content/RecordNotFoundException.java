package az.edu.azmiu.ibi.content;

public class RecordNotFoundException extends RuntimeException {
    public RecordNotFoundException(String resource) {
        super(resource + " not found");
    }
}
