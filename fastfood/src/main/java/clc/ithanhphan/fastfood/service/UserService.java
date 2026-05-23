package clc.ithanhphan.fastfood.service;

import clc.ithanhphan.fastfood.dto.request.UserCreationRequest;
import clc.ithanhphan.fastfood.mapper.UserMapper;
import clc.ithanhphan.fastfood.model.Role;
import clc.ithanhphan.fastfood.model.User;
import clc.ithanhphan.fastfood.repository.RoleRepository;
import clc.ithanhphan.fastfood.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private UserMapper userMapper;
    private PasswordEncoder passwordEncoder;

    @Transactional
    @PreAuthorize("hasRole('MANAGER')")
    public User createStaffUser(UserCreationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập này đã tồn tại!");
        }

        Role staffRole = roleRepository.findByName("staff")
                .orElseThrow(() -> new RuntimeException("Quyền 'staff' không tồn tại!"));

        User newUser = userMapper.toUser(request);

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        newUser.setPasswordHash(encodedPassword);

        newUser.setRole(staffRole);
        newUser.setIsActive(true);

        return userRepository.save(newUser);
    }
}
