package clc.ithanhphan.fastfood.controller;

import clc.ithanhphan.fastfood.dto.request.InventoryImportRequest;
import clc.ithanhphan.fastfood.dto.response.ApiResponse;
import clc.ithanhphan.fastfood.dto.response.InventoryTransactionResponse;
import clc.ithanhphan.fastfood.service.InventoryTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/inventory-transactions")
@RequiredArgsConstructor
public class InventoryTransactionController {

    private final InventoryTransactionService
            inventoryTransactionService;

    @PostMapping("/import")
    public ApiResponse<InventoryTransactionResponse>
    importInventory(

            @RequestBody
            @Valid
            InventoryImportRequest request

    ) {

        InventoryTransactionResponse result =
                inventoryTransactionService
                        .importInventory(request);

        return ApiResponse
                .<InventoryTransactionResponse>builder()
                .message("Nhập kho thành công")
                .result(result)
                .build();
    }
}
