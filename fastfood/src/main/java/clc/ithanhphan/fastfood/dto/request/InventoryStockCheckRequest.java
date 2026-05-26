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
public class InventoryStockCheckRequest {

    @NotNull(message = "Ingredient ID không được để trống")
    private Long ingredientId;

    @NotNull(message = "Số lượng thực tế không được để trống")
    @DecimalMin(
            value = "0.00",
            message = "Số lượng thực tế không hợp lệ"
    )
    private BigDecimal actualQuantity;

    @NotBlank(message = "Ghi chú không được để trống")
    private String note;
}
