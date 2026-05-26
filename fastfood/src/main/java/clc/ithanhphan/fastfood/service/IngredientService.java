package clc.ithanhphan.fastfood.service;

import clc.ithanhphan.fastfood.dto.response.IngredientResponse;
import clc.ithanhphan.fastfood.mapper.IngredientMapper;
import clc.ithanhphan.fastfood.model.Ingredient;
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

    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    public List<IngredientResponse> getAllIngredients() {

        List<Ingredient> ingredients =
                ingredientRepository.findAll();

        return ingredients.stream()
                .map(ingredientMapper::toIngredientResponse)
                .toList();
    }
}
