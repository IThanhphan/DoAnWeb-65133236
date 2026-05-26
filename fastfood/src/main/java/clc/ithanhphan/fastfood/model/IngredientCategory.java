package clc.ithanhphan.fastfood.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ingredient_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(
            name = "created_at",
            insertable = false,
            updatable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    )
    private LocalDateTime createdAt;

    @Column(
            name = "updated_at",
            insertable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    )
    private LocalDateTime updatedAt;
}