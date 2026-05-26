package clc.ithanhphan.fastfood.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    UNCATEGORIZED_EXCEPTION(
            9999,
            "Lỗi hệ thống",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),

    INGREDIENT_NOT_FOUND(
            2001,
            "Nguyên liệu không tồn tại",
            HttpStatus.NOT_FOUND
    );

    private final int code;

    private final String message;

    private final HttpStatus statusCode;

    ErrorCode(
            int code,
            String message,
            HttpStatus statusCode
    ) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}