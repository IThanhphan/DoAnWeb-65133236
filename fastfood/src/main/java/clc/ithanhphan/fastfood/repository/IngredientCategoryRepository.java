package clc.ithanhphan.fastfood.repository;

import clc.ithanhphan.fastfood.model.IngredientCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientCategoryRepository extends JpaRepository<IngredientCategory, Long> {
}
