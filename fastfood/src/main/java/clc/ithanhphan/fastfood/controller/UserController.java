package clc.ithanhphan.fastfood.controller;

import clc.ithanhphan.fastfood.dto.request.UserCreationRequest;
import clc.ithanhphan.fastfood.dto.response.ApiResponse;
import clc.ithanhphan.fastfood.model.User;
import clc.ithanhphan.fastfood.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private UserService userService;

    @PostMapping
    public ApiResponse<User> createStaff(@Valid @RequestBody UserCreationRequest request) {
        User createdUser = userService.createStaffUser(request);

        return ApiResponse.<User>builder()
                .message("Tạo tài khoản nhân viên thành công!")
                .build();
    }
}
