package clc.ithanhphan.fastfood.service;

import clc.ithanhphan.fastfood.dto.request.InventoryImportRequest;
import clc.ithanhphan.fastfood.dto.response.InventoryTransactionResponse;
import clc.ithanhphan.fastfood.enums.ErrorCode;
import clc.ithanhphan.fastfood.enums.InventoryTransactionType;
import clc.ithanhphan.fastfood.exceptions.AppException;
import clc.ithanhphan.fastfood.mapper.InventoryTransactionMapper;
import clc.ithanhphan.fastfood.model.Ingredient;
import clc.ithanhphan.fastfood.model.InventoryTransaction;
import clc.ithanhphan.fastfood.repository.IngredientRepository;
import clc.ithanhphan.fastfood.repository.InventoryTransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryTransactionService {

    private final IngredientRepository ingredientRepository;

    private final InventoryTransactionRepository
            inventoryTransactionRepository;

    private final InventoryTransactionMapper
            inventoryTransactionMapper;

    @PreAuthorize("hasRole('MANAGER')")
    public InventoryTransactionResponse importInventory(
            InventoryImportRequest request
    ) {

        Ingredient ingredient =
                ingredientRepository
                        .findById(request.getIngredientId())
                        .orElseThrow(() ->
                                new AppException(
                                        ErrorCode.INGREDIENT_NOT_FOUND
                                )
                        );

        ingredient.setStockQuantity(
                ingredient.getStockQuantity()
                        .add(request.getQuantity())
        );

        InventoryTransaction inventoryTransaction =
                InventoryTransaction.builder()
                        .ingredient(ingredient)
                        .transactionType(
                                InventoryTransactionType.NHẬP
                        )
                        .quantity(request.getQuantity())
                        .note(request.getNote())
                        .build();

        inventoryTransactionRepository
                .save(inventoryTransaction);

        ingredientRepository.save(ingredient);

        return inventoryTransactionMapper
                .toInventoryTransactionResponse(
                        inventoryTransaction
                );
    }
}
