package az.edu.azmiu.ibi.content;

import java.lang.reflect.RecordComponent;
import java.util.List;
import java.util.stream.Stream;

import az.edu.azmiu.ibi.model.Event;
import az.edu.azmiu.ibi.model.Mentor;
import az.edu.azmiu.ibi.model.News;
import az.edu.azmiu.ibi.model.Partner;
import az.edu.azmiu.ibi.model.Program;
import az.edu.azmiu.ibi.model.Startup;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ContentMapperTests {

    static Stream<Arguments> resources() {
        return Stream.of(
                Arguments.of(Program.class, ContentDtos.ProgramRequest.class, ContentDtos.ProgramResponse.class),
                Arguments.of(Event.class, ContentDtos.EventRequest.class, ContentDtos.EventResponse.class),
                Arguments.of(News.class, ContentDtos.NewsRequest.class, ContentDtos.NewsResponse.class),
                Arguments.of(Mentor.class, ContentDtos.MentorRequest.class, ContentDtos.MentorResponse.class),
                Arguments.of(Startup.class, ContentDtos.StartupRequest.class, ContentDtos.StartupResponse.class),
                Arguments.of(Partner.class, ContentDtos.PartnerRequest.class, ContentDtos.PartnerResponse.class));
    }

    @ParameterizedTest
    @MethodSource("resources")
    void requestAndResponseMatchExistingEntityFields(Class<?> entityType,
            Class<?> requestType, Class<?> responseType) throws Exception {
        RecordComponent[] components = requestType.getRecordComponents();
        Class<?>[] types = new Class<?>[components.length];
        Object[] values = new Object[components.length];
        for (int index = 0; index < components.length; index++) {
            types[index] = components[index].getType();
            values[index] = types[index] == boolean.class || types[index] == Boolean.class ? true
                    : types[index] == Integer.class ? 2
                    : List.class.isAssignableFrom(types[index]) ? List.of()
                    : "test value";
        }

        Object request = requestType.getDeclaredConstructor(types).newInstance(values);
        Object entity = entityType.getDeclaredConstructor().newInstance();
        ContentMapper.copyRequest(request, entity);
        Object response = ContentMapper.response(entity, responseType);

        for (RecordComponent component : components) {
            Object expected = component.getAccessor().invoke(request);
            Object actual = responseType.getMethod(component.getName()).invoke(response);
            assertEquals(expected, actual, component.getName());
        }
    }
}
