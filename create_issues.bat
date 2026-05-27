@echo off
chcp 65001 > nul
echo 🚀 Bắt đầu tạo 25 issues lên GitHub (Bản sửa lỗi CMD)...

call :create_issue "[backend] Thiet lap cau truc thu muc co so va cau hinh TypeScript/ESLint/Prettier" "backend" "- Khoi tao du an voi 'npm init' va thiet lap 'tsconfig.json'.\n- Cau hinh '.eslintrc.json' va '.prettierrc'.\n- Cai dat express/nestjs, dotenv, cors.\n- Tao cau truc thu muc chuan: controllers, services, routes, middlewares."

call :create_issue "[backend] Khoi tao Prisma ORM va thiet lap Database Schema ban dau" "backend" "- Chay 'npx prisma init'.\n- Dinh nghia Model User, MembershipPlan, UserMembership.\n- Cau hinh bien moi truong DATABASE_URL trong '.env.example'.\n- Chay migration dau tien: 'npx prisma migrate dev --name init'."

call :create_issue "[backend] Trien khai API Authentication bang JWT va ma hoa mat khau bang bcrypt" "backend" "- POST /api/auth/register (Ma hoa mat khau, check trung email).\n- POST /api/auth/login (Xac thuc thong tin, ky JWT kem role).\n- POST /api/auth/refresh (Xu ly gia han token).\n- Tao authMiddleware de check token."

call :create_issue "[backend] Phat trien API quan ly goi hoi vien (Membership CRUD)" "backend" "- GET /api/packages (Lay danh sach goi).\n- GET /api/packages/current (Lay goi hien tai cua user).\n- Tao seed du lieu mau cho 3 goi trong Prisma Seed.\n- Viet logic kiem tra thoi han va gioi han luot chat AI."

call :create_issue "[backend] Tich hop cong thanh toan VNPay va xu ly Webhook/Callback" "backend" "- POST /api/payments/create (Tao URL thanh toan).\n- GET/POST /api/payments/callback (Nhan ket qua IPN tu VNPay).\n- Cau hinh VNPAY_CODE, secret key trong .env.\n- Tu dong cap nhat goi hoi vien sau khi thanh toan thanh cong."

call :create_issue "[backend] Tich hop SDK OpenAI/Gemini va cau hinh boi canh cho AI Coach" "backend" "- POST /api/ai/chat (Goi API OpenAI/Gemini, tra ve phan hoi).\n- Cau hinh API key bao mat qua .env.\n- Thiet lap System Prompt dong vai Chuyen gia the hinh.\n- Viet Middleware dem so luot chat AI trong ngay theo goi."

call :create_issue "[backend] Luu tru va truy xuat lich su tro chuyen AI" "backend" "- GET /api/ai/history\n- Thiet ke model ChatMessage trong Prisma.\n- Luu tin nhan cua ca user va assistant vao DB sau moi luot chat.\n- Toi uu hoa truy van lich su theo dang phan trang (Pagination)."

call :create_issue "[frontend] Khoi tao du an Frontend bang React/Next.js voi TailwindCSS" "frontend" "- Khoi tao project React/Next.js bang TypeScript.\n- Tich hop TailwindCSS v3+.\n- Thiet lap Axios/Fetch Client tu dong dinh kem token JWT.\n- Tao cau truc thu muc: components, pages, services, hooks."

call :create_issue "[frontend] Thiet ke giao dien Dang nhap va Bao ve dinh tuyen (Route Guard)" "frontend" "- Tao form Dang nhap voi validation.\n- Luu tru JWT an toan (LocalStorage / Cookies).\n- Viet HOC hoac Middleware de check role ADMIN, redirect neu sai quyen."

call :create_issue "[frontend] Xay dung maninh Dashboard tong quan kem bieu do doanh thu" "frontend" "- Goi API GET /api/admin/stats va GET /api/admin/analytics.\n- Su dung thu vien Chart.js hoac Recharts de ve bieu do.\n- Hien thi cac the thong tin nhanh (Tong so hoi vien, so luot chat AI)."

call :create_issue "[frontend] Phat trien maninh quan ly danh sach nguoi dung" "frontend" "- Goi API GET /api/admin/users.\n- Thiet ke bang du lieu ho tro tim kiem, loc theo goi hoi vien.\n- Them nut khoa/mo khoa tai khoan hoac chinh sua thong tin."

call :create_issue "[mobile] Khoi tao du an Mobile bang React Native Expo" "mobile" "- Khoi tao du an bang Expo + TypeScript.\n- Cau hinh dieu huong voi @react-navigation/native va Bottom Tabs.\n- Thiet lape file .env chua API_BASE_URL tro ve backend."

call :create_issue "[mobile] Xay dung maninh Dang ky, Dang nhap va Quan ly Session" "mobile" "- Tao UI form Dang nhap/Dang ky bang TextInput, TouchableOpacity.\n- Su dung Expo SecureStore hoac AsyncStorage luu ma JWT.\n- Tu dong chuyen vao maninh chinh neu token cu van con hieu luc."

call :create_issue "[mobile] Thiet ke giao dien phong tro chuyen voi Huan luyen vien AI" "mobile" "- Tao danh sach tin nhan dang cuon bang FlatList.\n- Tao hieu ung hien thi AI dang go (Typing indicator).\n- Xu ly tu dong cuon xuong cuoi maninh (scrollToEnd) khi co tin nhan."

call :create_issue "[mobile] Trien khai maninh Quan ly goi hoi vien va Mua goi truc tuyen" "mobile" "- Hien thi the thanh vien dang do hoa (Ten, Loai goi, Ngay het han).\n- Tao danh sach cac goi dich vu nang cap kem gia tien.\n- Tich hop mo expo-web-browser khi bam mua de sang trang VNPay."

call :create_issue "[backend] Tich hop dich vu gui Push Notification tren ung dung di dong" "backend" "- Them truong pushToken trong model User de luu Token thiet bi.\n- Tich hop thu vien gui thong bao expo-server-sdk.\n- Viet dich vu dung chung NotificationService.sendPush(userId, title, body)."

call :create_issue "[backend] Xay dung cron-job tu dong quet va gui thong bao nhac han the" "backend" "- Su dung node-cron de thiet lap tac vu chay tu dong luc 00:00 hang ngay.\n- Tim kiem trong DB user co thoi gian het han goi con dung 3 ngay.\n- Thuc hien gui thong bao nhac nho nap tien / gia han."

call :create_issue "[backend] Ap dung Rate Limiting va CORS bao mat cho he thong API" "backend" "- Cai dat express-rate-limit.\n- Cau hinh CORS chat che, chi cho phep ten mien cua Frontend ket noi.\n- Ap dung bo loc du lieu dau vao bang class-validator hoac zod."

call :create_issue "[backend] Viet Unit Tests cho cac API cot loi (Auth va Payment)" "backend" "- Cau hinh framework kiem thu Jest trong thu muc backend.\n- Thuc hien mock co so du lieu Prisma de test doc lap.\n- Viet test case cho login thanh cong, that bai, va tinh toan so tien."

call :create_issue "[backend] Tich hop he thong theo doi loi tap trung Sentry" "backend" "- Dang ky du an tren Sentry va lay ma SENTRY_DSN.\n- Cai dat SDK Sentry cho backend.\n- Viet errorMiddleware de tu dong bat va day moi exception len Sentry."

call :create_issue "[infra] Viet cau hinh Dockerfile cho phan Backend" "infrastructure" "- Tao file backend/Dockerfile su dung moi truong Node.js LTS Alpine.\n- Viet cau hinh sao chep ma nguon, chay npm install --omit=dev.\n- Them lenh chay npx prisma generate truoc khi khoi dong server."

call :create_issue "[infra] Cau hinh CI/CD tu dong Deploy Frontend Admin len Vercel" "infrastructure" "- Lien ket kho chua GitHub voi tai quan Vercel.\n- Cau hinh cac bien moi truong can thiet tren Vercel (REACT_APP_API_URL).\n- Dam bao tu dong build thu nghiem truoc khi chap nhan Pull Request."

call :create_issue "[style] Ra soat toan bo du an loai bo ma cung" "documentation" "- Kiem tra khong de lo chuoi ket noi DB, API Key, hay ma JWT Secret.\n- Day toan bo cac gia tri nhay cam vao file .env.\n- Cap nhat day du file .env.example voi cac gia tri mau sach."

call :create_issue "[docs] Viet tai lieu huong dan chi tiet cho cac API Endpoint" "documentation" "- Viet ro cau truc Request Body va Response JSON mau cho tung API.\n- Dinh nghia ro cac ma loi tra ve (401, 403, 422)."

call :create_issue "[mobile] Dong goi ung dung di dong dang tep tin APK/IPA qua Expo EAS" "mobile" "- Cai dat cong cu eas-cli.\n- Cau hinh file eas.json cho tai khoan Expo ca nhan.\n- Chay lenh build ung dụng Android de xuat ra file APK thu nghiem."

echo 🎉 Da hoan thanh tat ca cac issues!
del /f /q issue_body.txt > nul 2>&1
pause
goto :eof

:create_issue
echo ➕ Dang tao: %~1
:: Ghi mo ta vao file tam de tranh loi ky tu dac biet cua CMD
echo %~3 > issue_body.txt
:: Goi gh cli doc body tu file tam
gh issue create --title %1 --label %2 --body-file issue_body.txt
timeout /t 1 > nul
goto :eof
