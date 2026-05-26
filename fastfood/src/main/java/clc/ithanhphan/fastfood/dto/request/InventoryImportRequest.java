package clc.ithanhphan.fastfood.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryImportRequest {

    @NotNull(message = "Ingredient ID không được để trống")
    private Long ingredientId;

    @NotNull(message = "Số lượng nhập không được để trống")
    private BigDecimal quantity;

    @NotBlank(message = "Ghi chú không được để trống")
    private String note;
}
