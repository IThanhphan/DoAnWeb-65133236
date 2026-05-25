package clc.ithanhphan.fastfood.controller;

import clc.ithanhphan.fastfood.dto.response.ApiResponse;
import clc.ithanhphan.fastfood.dto.response.CategoryResponse;
import clc.ithanhphan.fastfood.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAllCategories() {

        return ApiResponse.<List<CategoryResponse>>builder()
                .message("Lấy danh sách danh mục thành công")
                .result(categoryService.getAllCategories())
                .build();
    }
}
