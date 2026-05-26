package clc.ithanhphan.fastfood.exceptions;

import clc.ithanhphan.fastfood.dto.response.ApiResponse;
import clc.ithanhphan.fastfood.enums.ErrorCode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<?>> handlingAppException(
            AppException exception
    ) {

        ErrorCode errorCode = exception.getErrorCode();

        ApiResponse<?> apiResponse = ApiResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity
                .status(errorCode.getStatusCode())
                .body(apiResponse);
    }
    // 1. Xử lý các lỗi nghiệp vụ do bạn tự throw bằng RuntimeException
    @ExceptionHandler(value = RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleRuntimeException(RuntimeException exception) {
        return ApiResponse.builder()
                .code(4000) // Bạn tự quy định mã code cho lỗi nghiệp vụ (ví dụ: 4000)
                .message(exception.getMessage())
                .build(); // Trường 'result' tự động bị ẩn nhờ @JsonInclude(NON_NULL)
    }

    // 2. Xử lý các lỗi Validation (nhập sai ký tự, trống trường dữ liệu từ @Valid)
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleValidationException(MethodArgumentNotValidException exception) {
        // Lấy thông điệp lỗi đầu tiên tìm thấy trong danh sách các trường bị lỗi
        FieldError fieldError = exception.getBindingResult().getFieldError();
        String errorMessage = (fieldError != null) ? fieldError.getDefaultMessage() : "Dữ liệu đầu vào không hợp lệ";

        return ApiResponse.builder()
                .code(4001) // Mã code cho lỗi Validation đầu vào
                .message(errorMessage)
                .build();
    }

    // 3. Xử lý các lỗi hệ thống không xác định khác (Lỗi 500)
    @ExceptionHandler(value = Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<?> handleGenericException(Exception exception) {
        return ApiResponse.builder()
                .code(5000)
                .message("Đã xảy ra lỗi hệ thống nghiêm trọng: " + exception.getMessage())
                .build();
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse<?> handleResourceNotFoundException(
            ResourceNotFoundException exception
    ) {

        return ApiResponse.builder()
                .code(4000)
                .message(exception.getMessage())
                .build();
    }

    @ExceptionHandler(DuplicateResourceException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleDuplicateResourceException(
            DuplicateResourceException exception
    ) {

        return ApiResponse.builder()
                .code(4000)
                .message(exception.getMessage())
                .build();
    }

    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<?> handleBusinessException(
            BusinessException exception
    ) {

        return ApiResponse.builder()
                .code(4000)
                .message(exception.getMessage())
                .build();
    }
}
