package clc.ithanhphan.fastfood.repository;

import clc.ithanhphan.fastfood.model.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    boolean existsByCode(String code);

    boolean existsByName(String name);

    List<Ingredient> findByIsDeletedFalse();

    boolean existsByIdAndIsDeletedFalse(Long id);
}
