package clc.ithanhphan.fastfood.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientCreationRequest {

    @NotBlank(message = "Mã nguyên liệu không được để trống")
    @Size(max = 20, message = "Mã nguyên liệu tối đa 20 ký tự")
    private String code;

    @NotNull(message = "Nhóm nguyên liệu không được để trống")
    private Long ingredientCategoryId;

    @NotBlank(message = "Tên nguyên liệu không được để trống")
    @Size(max = 100, message = "Tên nguyên liệu tối đa 100 ký tự")
    private String name;

    @NotNull(message = "Số lượng tồn không được để trống")
    @DecimalMin(
            value = "0.00",
            message = "Số lượng tồn không hợp lệ"
    )
    private BigDecimal stockQuantity;

    @NotBlank(message = "Đơn vị không được để trống")
    @Size(max = 20, message = "Đơn vị tối đa 20 ký tự")
    private String unit;

    @NotNull(message = "Số lượng tối thiểu không được để trống")
    @DecimalMin(
            value = "0.00",
            message = "Số lượng tối thiểu không hợp lệ"
    )
    private BigDecimal minRequiredQuantity;
}
