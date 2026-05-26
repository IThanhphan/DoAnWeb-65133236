package clc.ithanhphan.fastfood.model;

import clc.ithanhphan.fastfood.enums.InventoryTransactionType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private InventoryTransactionType transactionType;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal quantity;

    @Column(length = 255)
    private String note;

    @Column(
            name = "created_at",
            insertable = false,
            updatable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    )
    private LocalDateTime createdAt;
}
