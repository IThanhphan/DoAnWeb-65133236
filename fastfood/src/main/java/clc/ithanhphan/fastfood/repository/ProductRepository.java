package clc.ithanhphan.fastfood.repository;

import clc.ithanhphan.fastfood.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByNameContainingIgnoreCase(String keyword);

    List<Product> findByCategory_Id(Long categoryId);

    List<Product> findByIsAvailable(Boolean isAvailable);

    List<Product> findByCategory_IdAndNameContainingIgnoreCase(
            Long categoryId,
            String keyword
    );
}
