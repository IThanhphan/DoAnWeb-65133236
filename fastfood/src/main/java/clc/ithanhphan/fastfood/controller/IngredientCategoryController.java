package clc.ithanhphan.fastfood.controller;

import clc.ithanhphan.fastfood.dto.response.ApiResponse;
import clc.ithanhphan.fastfood.dto.response.IngredientCategoryResponse;
import clc.ithanhphan.fastfood.service.IngredientCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ingredient-categories")
@RequiredArgsConstructor
public class IngredientCategoryController {

    private final IngredientCategoryService ingredientCategoryService;

    @GetMapping
    public ApiResponse<List<IngredientCategoryResponse>>
    getAllIngredientCategories() {

        List<IngredientCategoryResponse> result =
                ingredientCategoryService.getAllIngredientCategories();

        return ApiResponse
                .<List<IngredientCategoryResponse>>builder()
                .message("Lấy danh sách nhóm nguyên liệu thành công")
                .result(result)
                .build();
    }
}
