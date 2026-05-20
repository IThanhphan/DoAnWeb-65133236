package clc.ithanhphan.fastfood.service;

import clc.ithanhphan.fastfood.dto.request.UserCreationRequest;
import clc.ithanhphan.fastfood.mapper.UserMapper;
import clc.ithanhphan.fastfood.model.Role;
import clc.ithanhphan.fastfood.model.User;
import clc.ithanhphan.fastfood.repository.RoleRepository;
import clc.ithanhphan.fastfood.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
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
