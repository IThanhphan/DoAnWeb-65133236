package clc.ithanhphan.fastfood.controller;

import clc.ithanhphan.fastfood.dto.request.LoginRequest;
import clc.ithanhphan.fastfood.dto.response.ApiResponse;
import clc.ithanhphan.fastfood.dto.response.LoginResponse;
import clc.ithanhphan.fastfood.service.AuthService;
import clc.ithanhphan.fastfood.service.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    private final JwtService jwtService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) throws Exception {

        LoginResponse result = authService.login(request, response);

        return ApiResponse.<LoginResponse>builder()
                .message("Login thành công")
                .result(result)
                .build();
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("refreshToken", null);

        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);

        return ApiResponse.<Void>builder()
                .message("Logout thành công")
                .build();
    }

    @PostMapping("/refresh")
    public ApiResponse<LoginResponse> refreshToken(
            HttpServletRequest request
    ) throws Exception {

        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            throw new Exception("Không tìm thấy refresh token");
        }

        String refreshToken = null;

        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refreshToken")) {
                refreshToken = cookie.getValue();
            }
        }

        if (refreshToken == null) {
            throw new Exception("Refresh token không tồn tại");
        }

        if (!jwtService.isValidToken(refreshToken)) {
            throw new Exception("Refresh token không hợp lệ");
        }

        String username = jwtService.extractUsername(refreshToken);
        String role = jwtService.extractRole(refreshToken);

        String accessToken = jwtService.generateAccessToken(username, role);

        return ApiResponse.<LoginResponse>builder()
                .message("Refresh token thành công")
                .result(
                        LoginResponse.builder()
                                .accessToken(accessToken)
                                .build()
                )
                .build();
    }
}
