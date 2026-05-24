package clc.ithanhphan.fastfood.service;

import clc.ithanhphan.fastfood.dto.request.LoginRequest;
import clc.ithanhphan.fastfood.dto.response.LoginResponse;
import clc.ithanhphan.fastfood.model.User;
import clc.ithanhphan.fastfood.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(
            LoginRequest request,
            HttpServletResponse response
    ) throws Exception {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new Exception("Username hoặc password không đúng"));

        boolean isMatch = passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        );

        if (!isMatch) {
            throw new Exception("Username hoặc password không đúng");
        }

        String accessToken = jwtService.generateAccessToken(user.getUsername(), user.getRole().getName());

        String refreshToken = jwtService.generateRefreshToken(user.getUsername(), user.getRole().getName());

        Cookie cookie = new Cookie("refreshToken", refreshToken);

        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);

        response.addCookie(cookie);

        return LoginResponse.builder()
                .fullName(user.getFullName())
                .accessToken(accessToken)
                .build();
    }
}
