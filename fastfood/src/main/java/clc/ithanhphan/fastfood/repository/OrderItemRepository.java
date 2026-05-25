package clc.ithanhphan.fastfood.repository;

import clc.ithanhphan.fastfood.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository
        extends JpaRepository<OrderItem, Long> {

    boolean existsByProduct_Id(Long productId);
}
