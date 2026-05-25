package clc.ithanhphan.fastfood.service;

import clc.ithanhphan.fastfood.dto.response.CategoryResponse;
import clc.ithanhphan.fastfood.mapper.CategoryMapper;
import clc.ithanhphan.fastfood.model.Category;
import clc.ithanhphan.fastfood.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    private final CategoryMapper categoryMapper;

    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    public List<CategoryResponse> getAllCategories() {

        List<Category> categories =
                categoryRepository.findByIsActiveTrue();

        return categoryMapper.toCategoryResponseList(categories);
    }
}
