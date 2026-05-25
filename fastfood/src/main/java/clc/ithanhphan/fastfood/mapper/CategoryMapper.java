package clc.ithanhphan.fastfood.mapper;

import clc.ithanhphan.fastfood.dto.response.CategoryResponse;
import clc.ithanhphan.fastfood.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CategoryMapper {

    CategoryResponse toCategoryResponse(Category category);

    List<CategoryResponse> toCategoryResponseList(List<Category> categories);
}
