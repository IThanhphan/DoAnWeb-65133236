package clc.ithanhphan.fastfood.mapper;

import clc.ithanhphan.fastfood.dto.response.IngredientResponse;
import clc.ithanhphan.fastfood.model.Ingredient;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface IngredientMapper {

    IngredientResponse toIngredientResponse(Ingredient ingredient);
}
