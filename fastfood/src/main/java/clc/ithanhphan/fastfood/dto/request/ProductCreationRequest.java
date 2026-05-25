package clc.ithanhphan.fastfood.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreationRequest {

    @NotNull(message = "Danh mục món ăn không được để trống")
    private Long categoryId;

    @NotBlank(message = "Tên món ăn không được để trống")
    @Size(max = 150, message = "Tên món ăn không được vượt quá 150 ký tự")
    private String name;

    @NotNull(message = "Giá món ăn không được để trống")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "Giá món ăn phải lớn hơn 0")
    private BigDecimal price;

    private String imageUrl;

    @NotNull(message = "Trạng thái món ăn không được để trống")
    private Boolean isAvailable;
}
