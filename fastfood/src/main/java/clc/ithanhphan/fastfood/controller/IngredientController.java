package clc.ithanhphan.fastfood.controller;

import clc.ithanhphan.fastfood.dto.request.IngredientCreationRequest;
import clc.ithanhphan.fastfood.dto.response.ApiResponse;
import clc.ithanhphan.fastfood.dto.response.IngredientResponse;
import clc.ithanhphan.fastfood.service.IngredientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public ApiResponse<IngredientResponse>
    createIngredient(
            @RequestBody
            @Valid
            IngredientCreationRequest request
    ) {

        IngredientResponse result =
                ingredientService.createIngredient(request);

        return ApiResponse.<IngredientResponse>builder()
                .message("Tạo nguyên liệu thành công")
                .result(result)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteIngredient(
            @PathVariable Long id
    ) {

        ingredientService.deleteIngredient(id);

        return ApiResponse.<Void>builder()
                .message("Xóa nguyên liệu thành công")
                .build();
    }
}
