$issues = @(
    @("[backend] Thiết lập cấu trúc thư mục cơ sở và cấu hình TypeScript/ESLint/Prettier", "backend", "- Khởi tạo dự án với `npm init` và thiết lập `tsconfig.json`.`n- Cấu hình `.eslintrc.json` và `.prettierrc`.`n- Cài đặt express/nestjs, dotenv, cors.`n- Tạo cấu trúc thư mục chuẩn: controllers, services, routes, middlewares."),
    @("[backend] Khởi tạo Prisma ORM và thiết lập Database Schema ban đầu", "backend", "- Chạy `npx prisma init`.`n- Định nghĩa Model User, MembershipPlan, UserMembership.`n- Cấu hình biến môi trường DATABASE_URL trong `.env.example`.`n- Chạy migration đầu tiên: `npx prisma migrate dev --name init`."),
    @("[backend] Triển khai API Authentication bằng JWT và mã hóa mật khẩu bằng bcrypt", "backend", "- POST /api/auth/register (Mã hóa mật khẩu, check trùng email).`n- POST /api/auth/login (Xác thực thông tin, ký JWT kèm role).`n- POST /api/auth/refresh (Xử lý gia hạn token).`n- Tạo authMiddleware để check token."),
    @("[backend] Phát triển API quản lý gói hội viên (Membership CRUD)", "backend", "- GET /api/packages (Lấy danh sách gói).`n- GET /api/packages/current (Lấy gói hiện tại của user).`n- Tạo seed dữ liệu mẫu cho 3 gói trong Prisma Seed.`n- Viết logic kiểm tra thời hạn và giới hạn lượt chat AI."),
    @("[backend] Tích hợp cổng thanh toán VNPay và xử lý Webhook/Callback", "backend", "- POST /api/payments/create (Tạo URL thanh toán).`n- GET/POST /api/payments/callback (Nhận kết quả IPN từ VNPay).`n- Cấu hình VNPAY_CODE, secret key trong .env.`n- Tự động cập nhật gói hội viên sau khi thanh toán thành công."),
    @("[backend] Tích hợp SDK OpenAI/Gemini và cấu hình bối cảnh cho AI Coach", "backend", "- POST /api/ai/chat (Gọi API OpenAI/Gemini, trả về phản hồi).`n- Cấu hình API key bảo mật qua .env.`n- Thiết lập System Prompt đóng vai Chuyên gia thể hình.`n- Viết Middleware đếm số lượt chat AI trong ngày theo gói."),
    @("[backend] Lưu trữ và truy xuất lịch sử trò chuyện AI", "backend", "- GET /api/ai/history`n- Thiết kế model ChatMessage trong Prisma.`n- Lưu tin nhắn của cả user và assistant vào DB sau mỗi lượt chat.`n- Tối ưu hóa truy vấn lịch sử theo dạng phân trang (Pagination)."),
    @("[frontend] Khởi tạo dự án Frontend bằng React/Next.js với TailwindCSS", "frontend", "- Khởi tạo project React/Next.js bằng TypeScript.`n- Tích hợp TailwindCSS v3+.`n- Thiết lập Axios/Fetch Client tự động đính kèm token JWT.`n- Tạo cấu trúc thư mục: components, pages, services, hooks."),
    @("[frontend] Thiết kế giao diện Đăng nhập và Bảo vệ định tuyến (Route Guard)", "frontend", "- Tạo form Đăng nhập với validation.`n- Lưu trữ JWT an toàn (LocalStorage / Cookies).`n- Viết HOC hoặc Middleware để check role ADMIN, redirect nếu sai quyền."),
    @("[frontend] Xây dựng màn hình Dashboard tổng quan kèm biểu đồ doanh thu", "frontend", "- Gọi API GET /api/admin/stats và GET /api/admin/analytics.`n- Sử dụng thư viện Chart.js hoặc Recharts để vẽ biểu đồ.`n- Hiển thị các thẻ thông tin nhanh (Tổng số hội viên, số lượt chat AI)."),
    @("[frontend] Phát triển màn hình quản lý danh sách người dùng", "frontend", "- Gọi API GET /api/admin/users.`n- Thiết kế bảng dữ liệu hỗ trợ tìm kiếm, lọc theo gói hội viên.`n- Thêm nút khóa/mở khóa tài khoản hoặc chỉnh sửa thông tin."),
    @("[mobile] Khởi tạo ứng dụng Mobile bằng React Native Expo", "mobile", "- Khởi tạo dự án bằng Expo + TypeScript.`n- Cấu hình điều hướng với @react-navigation/native và Bottom Tabs.`n- Thiết lập file .env chứa API_BASE_URL trỏ về backend."),
    @("[mobile] Xây dựng màn hình Đăng ký, Đăng nhập và Quản lý Session", "mobile", "- Tạo UI form Đăng nhập/Đăng ký bằng TextInput, TouchableOpacity.`n- Sử dụng Expo SecureStore hoặc AsyncStorage lưu mã JWT.`n- Tự động chuyển vào màn hình chính nếu token cũ vẫn còn hiệu lực."),
    @("[mobile] Thiết kế giao diện phòng trò chuyện với Huấn luyện viên AI", "mobile", "- Tạo danh sách tin nhắn dạng cuộn bằng FlatList.`n- Tạo hiệu ứng hiển thị AI đang gõ (Typing indicator).`n- Xử lý tự động cuộn xuống cuối màn hình (scrollToEnd) khi có tin nhắn."),
    @("[mobile] Triển khai màn hình Quản lý gói hội viên và Mua gói trực tuyến", "mobile", "- Hiển thị thẻ thành viên dạng đồ họa (Tên, Loại gói, Ngày hết hạn).`n- Tạo danh sách các gói dịch vụ nâng cấp kèm giá tiền.`n- Tích hợp mở expo-web-browser khi bấm mua để sang trang VNPay."),
    @("[backend] Tích hợp dịch vụ gửi Push Notification trên ứng dụng di động", "backend", "- Thêm trường pushToken trong model User để lưu Token thiết bị.`n- Tích hợp thư viện gửi thông báo expo-server-sdk.`n- Viết dịch vụ dùng chung NotificationService.sendPush(userId, title, body)."),
    @("[backend] Xây dựng cron-job tự động quét và gửi thông báo nhắc hạn thẻ", "backend", "- Sử dụng node-cron để thiết lập tác vụ chạy tự động lúc 00:00 hằng ngày.`n- Tìm kiếm trong DB user có thời gian hết hạn gói còn đúng 3 ngày.`n- Thực hiện gửi thông báo nhắc nhở nạp tiền / gia hạn."),
    @("[backend] Áp dụng Rate Limiting và CORS bảo mật cho hệ thống API", "backend", "- Cài đặt express-rate-limit.`n- Cấu hình CORS chặt chẽ, chỉ cho phép tên miền của Frontend kết nối.`n- Áp dụng bộ lọc dữ liệu đầu vào bằng class-validator hoặc zod."),
    @("[backend] Viết Unit Tests cho các API cốt lõi (Auth và Payment)", "backend", "- Cấu hình framework kiểm thử Jest trong thư mục backend.`n- Thực hiện mock cơ sở dữ liệu Prisma để test độc lập.`n- Viết test case cho login thành công, thất bại, và tính toán số tiền."),
    @("[backend] Tích hợp hệ thống theo dõi lỗi tập trung Sentry", "backend", "- Đăng ký dự án trên Sentry và lấy mã SENTRY_DSN.`n- Cài đặt SDK Sentry cho backend.`n- Viết errorMiddleware để tự động bắt và đẩy mọi exception lên Sentry."),
    @("[infra] Viết cấu hình Dockerfile cho phần Backend", "infrastructure", "- Tạo file backend/Dockerfile sử dụng môi trường Node.js LTS Alpine.`n- Viết cấu hình sao chép mã nguồn, chạy npm install --omit=dev.`n- Thêm lệnh chạy npx prisma generate trước khi khởi động server."),
    @("[infra] Cấu hình CI/CD tự động Deploy Frontend Admin lên Vercel", "infrastructure", "- Liên kết kho chứa GitHub với tài khoản Vercel.`n- Cấu hình các biến môi trường cần thiết trên Vercel (REACT_APP_API_URL).`n- Đảm bảo tự động build thử nghiệm trước khi chấp nhận Pull Request."),
    @("[style] Rà soát toàn bộ dự án loại bỏ mã cứng", "documentation", "- Kiểm tra không để lộ chuỗi kết nối DB, API Key, hay mã JWT Secret.`n- Đưa toàn bộ các giá trị nhạy cảm vào file .env.`n- Cập nhật đầy đủ file .env.example với các giá trị mẫu sạch."),
    @("[docs] Viết tài liệu hướng dẫn chi tiết cho các API Endpoint", "documentation", "- Viết rõ cấu trúc Request Body và Response JSON mẫu cho từng API.`n- Định nghĩa rõ các mã lỗi trả về (401, 403, 422)."),
    @("[mobile] Đóng gói ứng dụng di động dạng tệp tin APK/IPA qua Expo EAS", "mobile", "- Cài đặt công cụ eas-cli.`n- Cấu hình file eas.json cho tài khoản Expo cá nhân.`n- Chạy lệnh build ứng dụng Android để xuất ra file APK thử nghiệm.")
)

Write-Host "🚀 Bắt đầu tạo 25 issues lên GitHub bằng PowerShell..."

foreach ($issue in $issues) {
    $title = $issue[0]
    $label = $issue[1]
    $body = $issue[2]

    Write-Host "➕ Đang tạo: $title"
    
    # Thực thi lệnh của GitHub CLI
    gh issue create --title $title --label $label --body $body

    Start-Sleep -Seconds 1
}

Write-Host "🎉 Đã tạo thành công tất cả issues!"
