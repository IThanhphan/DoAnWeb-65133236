package clc.ithanhphan.fastfood.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryTransactionResponse {

    private Long id;

    private Long ingredientId;

    private String ingredientName;

    private String transactionType;

    private BigDecimal quantity;

    private String note;

    private LocalDateTime createdAt;
}
