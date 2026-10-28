package az.edu.azmiu.ibi.content;

import az.edu.azmiu.ibi.content.ContentDtos.NewsRequest;
import az.edu.azmiu.ibi.content.ContentDtos.NewsResponse;
import az.edu.azmiu.ibi.model.News;
import jakarta.validation.Validator;
import org.springframework.stereotype.Service;

@Service
public class NewsService extends CrudService<News, NewsRequest, NewsResponse> {

    public NewsService(NewsRepository repository, Validator validator) {
        super(repository, News.class, NewsResponse.class, validator, "News");
    }
}
