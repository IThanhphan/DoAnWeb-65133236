package clc.ithanhphan.fastfood.controller;

import clc.ithanhphan.fastfood.dto.request.ProductCreationRequest;
import clc.ithanhphan.fastfood.dto.request.ProductUpdateRequest;
import clc.ithanhphan.fastfood.dto.response.ApiResponse;
import clc.ithanhphan.fastfood.dto.response.ProductResponse;
import clc.ithanhphan.fastfood.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProducts(

            @RequestParam(required = false)
            String keyword,

            @RequestParam(required = false)
            Long categoryId,

            @RequestParam(required = false)
            Boolean isAvailable
    ) {

        return ApiResponse.<List<ProductResponse>>builder()
                .message("Lấy danh sách món ăn thành công")
                .result(
                        productService.getAllProducts(
                                keyword,
                                categoryId,
                                isAvailable
                        )
                )
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ProductResponse> getProductById(
            @PathVariable Long id
    ) {

        return ApiResponse.<ProductResponse>builder()
                .message("Lấy chi tiết món ăn thành công")
                .result(productService.getProductById(id))
                .build();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ProductResponse> createProduct(
            @Valid @RequestBody ProductCreationRequest request
    ) {

        return ApiResponse.<ProductResponse>builder()
                .message("Tạo món ăn thành công")
                .result(productService.createProduct(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ProductResponse> updateProduct(

            @PathVariable Long id,

            @Valid
            @RequestBody
            ProductUpdateRequest request
    ) {

        return ApiResponse.<ProductResponse>builder()
                .message("Cập nhật món ăn thành công")
                .result(
                        productService.updateProduct(id, request)
                )
                .build();
    }
}
