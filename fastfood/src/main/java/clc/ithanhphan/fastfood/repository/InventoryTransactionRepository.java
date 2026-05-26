package clc.ithanhphan.fastfood.repository;

import clc.ithanhphan.fastfood.model.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    List<InventoryTransaction>
    findByIngredient_IdOrderByCreatedAtDesc(
            Long ingredientId
    );
}
