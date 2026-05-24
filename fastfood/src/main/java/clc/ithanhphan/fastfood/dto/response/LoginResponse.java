package clc.ithanhphan.fastfood.dto.response;

import clc.ithanhphan.fastfood.model.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String fullName;
    private String accessToken;
}
