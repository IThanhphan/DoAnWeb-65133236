package clc.ithanhphan.fastfood.mapper;

import clc.ithanhphan.fastfood.dto.response.InventoryTransactionResponse;
import clc.ithanhphan.fastfood.model.InventoryTransaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface InventoryTransactionMapper {

    @Mapping(
            target = "ingredientId",
            source = "ingredient.id"
    )
    @Mapping(
            target = "ingredientName",
            source = "ingredient.name"
    )
    @Mapping(
            target = "transactionType",
            source = "transactionType"
    )
    InventoryTransactionResponse
    toInventoryTransactionResponse(
            InventoryTransaction inventoryTransaction
    );
}
