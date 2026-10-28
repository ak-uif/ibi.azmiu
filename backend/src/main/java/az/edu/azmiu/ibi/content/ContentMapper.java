package az.edu.azmiu.ibi.content;

import java.lang.reflect.Field;
import java.lang.reflect.RecordComponent;
import java.util.Arrays;

final class ContentMapper {

    private ContentMapper() {
    }

    static void copyRequest(Object request, Object entity) {
        try {
            for (RecordComponent component : request.getClass().getRecordComponents()) {
                Field field = findField(entity.getClass(), component.getName());
                field.setAccessible(true);
                Object value = component.getAccessor().invoke(request);
                field.set(entity, value == null && field.getType() == boolean.class ? false : value);
            }
        } catch (ReflectiveOperationException exception) {
            throw new IllegalStateException("Content mapping failed", exception);
        }
    }

    static <R> R response(Object entity, Class<R> responseType) {
        try {
            RecordComponent[] components = responseType.getRecordComponents();
            Class<?>[] types = Arrays.stream(components).map(RecordComponent::getType).toArray(Class<?>[]::new);
            Object[] values = new Object[components.length];
            for (int index = 0; index < components.length; index++) {
                Field field = findField(entity.getClass(), components[index].getName());
                field.setAccessible(true);
                values[index] = field.get(entity);
            }
            return responseType.getDeclaredConstructor(types).newInstance(values);
        } catch (ReflectiveOperationException exception) {
            throw new IllegalStateException("Content mapping failed", exception);
        }
    }

    private static Field findField(Class<?> type, String name) throws NoSuchFieldException {
        for (Class<?> current = type; current != null; current = current.getSuperclass()) {
            try {
                return current.getDeclaredField(name);
            } catch (NoSuchFieldException ignored) {
                // Continue into BaseEntity for ID and timestamps.
            }
        }
        throw new NoSuchFieldException(name);
    }
}
