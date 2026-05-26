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
    ),

    INGREDIENT_CATEGORY_NOT_FOUND(
            2002,
            "Nhóm nguyên liệu không tồn tại",
            HttpStatus.NOT_FOUND
    ),

    INGREDIENT_CODE_EXISTED(
            2003,
            "Mã nguyên liệu đã tồn tại",
            HttpStatus.BAD_REQUEST
    ),

    INGREDIENT_NAME_EXISTED(
            2004,
            "Tên nguyên liệu đã tồn tại",
            HttpStatus.BAD_REQUEST
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