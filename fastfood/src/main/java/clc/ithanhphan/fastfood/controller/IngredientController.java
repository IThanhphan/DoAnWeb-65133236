package clc.ithanhphan.fastfood.controller;

import clc.ithanhphan.fastfood.dto.response.ApiResponse;
import clc.ithanhphan.fastfood.dto.response.IngredientResponse;
import clc.ithanhphan.fastfood.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ingredients")
@RequiredArgsConstructor
public class IngredientController {

    private final IngredientService ingredientService;

    @GetMapping
    public ApiResponse<List<IngredientResponse>> getAllIngredients() {

        List<IngredientResponse> result =
                ingredientService.getAllIngredients();

        return ApiResponse.<List<IngredientResponse>>builder()
                .message("Lấy danh sách nguyên liệu thành công")
                .result(result)
                .build();
    }
}
