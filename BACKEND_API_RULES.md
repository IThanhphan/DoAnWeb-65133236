1. Tổng quan dự án

Dự án:

FASTFOOD MANAGEMENT SYSTEM

Mục tiêu:

quản lý quán ăn nhanh
quản lý nhân viên
quản lý thực đơn
quản lý bàn ăn
quản lý order
quản lý thanh toán
quản lý kho
báo cáo doanh thu 2. Công nghệ sử dụng
Backend
Java Spring Boot
Spring Security
JWT Authentication
Spring Data JPA
MySQL
MapStruct
Lombok
Frontend
ReactJS
TailwindCSS 3. Kiến trúc backend chuẩn

Backend sử dụng kiến trúc:

Controller
↓
Service
↓
Repository
↓
Database

Kết hợp:

DTO Request
DTO Response
Mapper
JWT Filter
Global Exception Handler
Role Authorization 4. Cấu trúc package chuẩn
clc.ithanhphan.fastfood
│
├── configuration
├── controller
├── dto
│ ├── request
│ └── response
├── exceptions
├── mapper
├── model
├── repository
├── service 5. Quy tắc viết Entity
5.1 Rule chung

Mỗi entity phải:

@Entity
@Table(name = "table_name")

Luôn dùng Lombok:

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
5.2 Primary Key
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
5.3 Quan hệ Entity
ManyToOne

Luôn dùng:

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "role_id", nullable = false)
private Role role;

Rule:

luôn dùng FetchType.LAZY
luôn dùng @JoinColumn
5.4 Enum

Luôn dùng:

@Enumerated(EnumType.STRING)

Không dùng ordinal.

Ví dụ:

public enum OrderStatus {
pending,
processing,
completed,
cancelled
}
5.5 Timestamp

Database tự quản lý timestamp.

created_at
@Column(
name = "created_at",
insertable = false,
updatable = false,
columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
)
private LocalDateTime createdAt;
updated_at
@Column(
name = "updated_at",
insertable = false,
columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
)
private LocalDateTime updatedAt;
5.6 Không trả Entity trực tiếp ra frontend

KHÔNG nên:

ApiResponse<User>

Nên:

ApiResponse<UserResponse>

Lý do:

tránh lộ passwordHash
tránh lazy loading issue
tránh lộ field nội bộ 6. Quy tắc viết DTO Request
6.1 Rule chung

DTO Request:

chỉ chứa dữ liệu frontend được phép gửi
không dùng Entity trực tiếp
6.2 Validation syntax

Dùng:

import jakarta.validation.constraints.\*;

Ví dụ:

@NotBlank
@Size
@Pattern
6.3 DTO validation chỉ dùng cho syntax validation

DTO validation xử lý:

field rỗng
sai format
độ dài
regex

Ví dụ:

username quá ngắn
password thiếu ký tự
phone sai format
6.4 Không viết business validation trong DTO

KHÔNG làm:

username đã tồn tại

trong DTO.

Business validation phải viết trong Service.

7.  Quy tắc viết DTO Response
    7.1 Response chuẩn toàn hệ thống
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public class ApiResponse<T> {

        int code = 1000;

        String message;

        T result;

    }
    7.2 Response thành công
    {
    "code": 1000,
    "message": "Success",
    "result": {}
    }
    7.3 Response lỗi
    {
    "code": 4000,
    "message": "Tên đăng nhập đã tồn tại"
    }

8.  Quy tắc viết Mapper
    8.1 Sử dụng MapStruct
    @Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
    8.2 Mapper chỉ dùng để map

Mapper:

KHÔNG xử lý business logic
KHÔNG query database
KHÔNG encode password
8.3 Mapper chỉ convert

Ví dụ:

UserCreationRequest → User
User → UserResponse
8.4 Field hệ thống phải ignore

Ví dụ:

@Mapping(target = "id", ignore = true)
@Mapping(target = "role", ignore = true)
@Mapping(target = "createdAt", ignore = true)
@Mapping(target = "updatedAt", ignore = true) 9. Quy tắc viết Repository
9.1 Repository chuẩn
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
9.2 Ưu tiên query method của Spring Data JPA

Ví dụ:

findByUsername
existsByUsername
findByName
9.3 Không viết business logic trong Repository

Repository chỉ:

query database
save entity 10. Quy tắc viết Service
10.1 Service là nơi chứa business logic

Service xử lý:

business validation
transaction
authorization logic
encode password
inventory logic
order logic
10.2 Ưu tiên constructor injection

KHÔNG ưu tiên:

@Autowired
private UserRepository userRepository;

Nên dùng:

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

}
10.3 Flow chuẩn trong Service
Validate
→ Query DB
→ Business Logic
→ Save DB
→ Return Result
10.4 Business validation viết trong Service

Ví dụ:

username đã tồn tại
role không tồn tại
bàn đang occupied
món đã hết
kho không đủ nguyên liệu
10.5 Encode password trong Service

Luôn:

passwordEncoder.encode(rawPassword)

Không bao giờ lưu password thô.

10.6 Chỉ dùng @Transactional ở Service layer

Đúng:

@Service
@Transactional

Sai:

Controller
Repository
10.7 Authorization

Dùng:

@PreAuthorize("hasRole('MANAGER')")

Role trong database:

manager
staff

Spring Security tự convert thành:

ROLE_MANAGER
ROLE_STAFF
10.8 Không dùng RuntimeException bừa bãi

Ưu tiên custom exception.

Ví dụ:

AppException
ResourceNotFoundException
DuplicateResourceException 11. Quy tắc viết Controller
11.1 Controller chỉ xử lý HTTP layer

Controller:

nhận request
validate request
gọi service
trả response

KHÔNG viết:

business logic
query database
11.2 RESTful API naming

Ví dụ:

POST /users
GET /users
GET /users/{id}
PUT /users/{id}
DELETE /users/{id}
11.3 Request phải dùng @Valid

Ví dụ:

@PostMapping
public ApiResponse<?> create(
@Valid @RequestBody UserCreationRequest request
)
11.4 Controller trả ApiResponse

Ví dụ:

return ApiResponse.builder()
.message("Tạo thành công")
.result(data)
.build();
11.5 API hiện tại không bắt buộc ResponseEntity

Ưu tiên:

ApiResponse
@ResponseStatus
GlobalExceptionHandler 12. Quy tắc Authentication & JWT
12.1 Frontend gửi JWT
Authorization: Bearer <token>
12.2 JwtAuthenticationFilter

Filter sẽ:

lấy token
validate token
extract username
extract role
set SecurityContext
12.3 Public API
.requestMatchers("/auth/\*\*").permitAll()
12.4 Protected API
.anyRequest().authenticated() 13. Quy tắc Exception Handling
13.1 Dùng GlobalExceptionHandler
@RestControllerAdvice
13.2 Validation Exception
@ExceptionHandler(MethodArgumentNotValidException.class)

Code:

4001
13.3 Business Exception

Ví dụ:

username đã tồn tại
role không tồn tại
hết hàng

Code:

4000
13.4 System Exception
@ExceptionHandler(Exception.class)

HTTP:

500 INTERNAL_SERVER_ERROR

Code:

5000 14. Quy tắc bảo mật hệ thống
14.1 Manager được phép
tạo nhân viên
sửa menu
quản lý kho
xem báo cáo
quản lý hệ thống
14.2 Staff được phép
tạo order
thanh toán
quản lý bàn
xử lý đơn
14.3 Staff KHÔNG được
sửa giá món
xóa hóa đơn
xem báo cáo quản trị
sửa role 15. Quy tắc dữ liệu hệ thống
15.1 Không xóa cứng dữ liệu quan trọng

Ưu tiên:

isActive
isAvailable

Thay vì:

DELETE FROM ...
15.2 Snapshot data cho order

Ví dụ:

snapshotPrice

Mục đích:

giữ nguyên dữ liệu hóa đơn cũ
tránh thay đổi giá ảnh hưởng báo cáo
15.3 Inventory phải kiểm tra tồn kho

Khi tạo order:

trừ nguyên liệu
kiểm tra tồn kho
cảnh báo dưới min quantity 16. Quy tắc naming convention
16.1 Entity

PascalCase:

User
OrderItem
DiningTable
16.2 Table

snake_case:

order_items
dining_tables
16.3 Variable

camelCase:

fullName
phoneNumber
createdAt
16.4 API URL

RESTful:

/users
/orders
/products 17. Quy tắc frontend-backend communication

Frontend React:

gọi API bằng Axios
gửi JWT qua Authorization Header
nhận response theo ApiResponse 18. Quy tắc khi phát triển API mới

Khi tạo API mới cần:

tạo Entity
tạo Repository
tạo DTO Request
tạo DTO Response
tạo Mapper
tạo Service
tạo Controller
thêm validation
thêm authorization
xử lý exception
trả ApiResponse chuẩn 19. Quy tắc coding style toàn dự án

Backend phải:

clean
dễ maintain
dễ scale
chuẩn REST API
bảo mật JWT
thống nhất coding style
dễ tích hợp React frontend
dễ mở rộng inventory/report/dashboard sau này
