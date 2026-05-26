package clc.ithanhphan.fastfood.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientResponse {

    private Long id;

    private String code;

    private String name;

    private Double stockQuantity;

    private String unit;

    private Double minRequiredQuantity;

    private String status;

    private IngredientCategoryResponse ingredientCategory;

    private LocalDateTime updatedAt;
}
