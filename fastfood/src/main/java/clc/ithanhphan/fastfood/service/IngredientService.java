package clc.ithanhphan.fastfood.service;

import clc.ithanhphan.fastfood.dto.request.IngredientCreationRequest;
import clc.ithanhphan.fastfood.dto.response.IngredientResponse;
import clc.ithanhphan.fastfood.enums.ErrorCode;
import clc.ithanhphan.fastfood.exceptions.AppException;
import clc.ithanhphan.fastfood.mapper.IngredientMapper;
import clc.ithanhphan.fastfood.model.Ingredient;
import clc.ithanhphan.fastfood.model.IngredientCategory;
import clc.ithanhphan.fastfood.repository.IngredientCategoryRepository;
import clc.ithanhphan.fastfood.repository.IngredientRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class IngredientService {

    private final IngredientRepository ingredientRepository;
    private final IngredientMapper ingredientMapper;
    private final IngredientCategoryRepository ingredientCategoryRepository;

    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    public List<IngredientResponse> getAllIngredients() {

        List<Ingredient> ingredients =
                ingredientRepository.findByIsDeletedFalse();

        return ingredients.stream()
                .map(ingredientMapper::toIngredientResponse)
                .toList();
    }

    @PreAuthorize("hasRole('MANAGER')")
    public IngredientResponse createIngredient(
            IngredientCreationRequest request
    ) {

        if (ingredientRepository.existsByCode(request.getCode())) {
            throw new AppException(
                    ErrorCode.INGREDIENT_CODE_EXISTED
            );
        }

        if (ingredientRepository.existsByName(request.getName())) {
            throw new AppException(
                    ErrorCode.INGREDIENT_NAME_EXISTED
            );
        }

        IngredientCategory ingredientCategory =
                ingredientCategoryRepository
                        .findById(
                                request.getIngredientCategoryId()
                        )
                        .orElseThrow(() ->
                                new AppException(
                                        ErrorCode
                                                .INGREDIENT_CATEGORY_NOT_FOUND
                                )
                        );

        Ingredient ingredient = Ingredient.builder()
                .code(request.getCode())
                .ingredientCategory(ingredientCategory)
                .name(request.getName())
                .stockQuantity(request.getStockQuantity())
                .unit(request.getUnit())
                .minRequiredQuantity(
                        request.getMinRequiredQuantity()
                )
                .build();

        ingredientRepository.save(ingredient);

        return ingredientMapper
                .toIngredientResponse(ingredient);
    }

    @PreAuthorize("hasRole('MANAGER')")
    public void deleteIngredient(Long id) {

        Ingredient ingredient =
                ingredientRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new AppException(
                                        ErrorCode.INGREDIENT_NOT_FOUND
                                )
                        );

        ingredient.setIsDeleted(true);

        ingredientRepository.save(ingredient);
    }
}
