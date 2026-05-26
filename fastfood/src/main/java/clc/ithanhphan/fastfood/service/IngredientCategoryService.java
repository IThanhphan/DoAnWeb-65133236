package clc.ithanhphan.fastfood.service;

import clc.ithanhphan.fastfood.dto.response.IngredientCategoryResponse;
import clc.ithanhphan.fastfood.mapper.IngredientCategoryMapper;
import clc.ithanhphan.fastfood.model.IngredientCategory;
import clc.ithanhphan.fastfood.repository.IngredientCategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class IngredientCategoryService {

    private final IngredientCategoryRepository
            ingredientCategoryRepository;

    private final IngredientCategoryMapper
            ingredientCategoryMapper;

    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    public List<IngredientCategoryResponse>
    getAllIngredientCategories() {

        List<IngredientCategory> categories =
                ingredientCategoryRepository.findAll();

        return categories.stream()
                .map(
                        ingredientCategoryMapper
                                ::toIngredientCategoryResponse
                )
                .toList();
    }
}