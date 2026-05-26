package clc.ithanhphan.fastfood.mapper;

import clc.ithanhphan.fastfood.dto.response.IngredientCategoryResponse;
import clc.ithanhphan.fastfood.model.IngredientCategory;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface IngredientCategoryMapper {

    IngredientCategoryResponse
    toIngredientCategoryResponse(
            IngredientCategory ingredientCategory
    );
}
