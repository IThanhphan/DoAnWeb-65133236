package clc.ithanhphan.fastfood.service;

import clc.ithanhphan.fastfood.dto.response.ProductResponse;
import clc.ithanhphan.fastfood.exceptions.ResourceNotFoundException;
import clc.ithanhphan.fastfood.mapper.ProductMapper;
import clc.ithanhphan.fastfood.model.Product;
import clc.ithanhphan.fastfood.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    private final ProductMapper productMapper;

    @Transactional
    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    public List<ProductResponse> getAllProducts(
            String keyword,
            Long categoryId,
            Boolean isAvailable
    ) {

        List<Product> products;

        // Filter category + keyword
        if (categoryId != null && keyword != null && !keyword.isBlank()) {

            products = productRepository
                    .findByCategory_IdAndNameContainingIgnoreCase(
                            categoryId,
                            keyword
                    );
        }

        // Filter category
        else if (categoryId != null) {

            products = productRepository.findByCategory_Id(categoryId);
        }

        // Filter keyword
        else if (keyword != null && !keyword.isBlank()) {

            products = productRepository
                    .findByNameContainingIgnoreCase(keyword);
        }

        // Filter available
        else if (isAvailable != null) {

            products = productRepository.findByIsAvailable(isAvailable);
        }

        // Get all
        else {

            products = productRepository.findAll();
        }

        return productMapper.toProductResponseList(products);
    }

    public ProductResponse getProductById(Long id) {

        Product product = productRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Không tìm thấy món ăn với id: " + id
                        )
                );

        return productMapper.toProductResponse(product);
    }
}