#!/usr/bin/env bash
# baseline-orphan-tables.sh
#
# MỤC ĐÍCH:
#   Một số bảng (Booking, TrainerProfile, TrainerSchedule, TrainerCheckIn)
#   và vài cột User (emailVerified, ...) đang tồn tại thật trong DB nhưng
#   KHÔNG có migration "CREATE TABLE" chính thức trong lịch sử (rất có thể
#   do trước đây có người dùng `prisma db push` hoặc sửa tay trên DB).
#
#   Script này tạo 1 migration "baseline" — ghi nhận vào lịch sử rằng các
#   bảng này đã tồn tại, KHÔNG chạy lại SQL tạo bảng (vì bảng đã có sẵn).
#   Sau khi baseline xong, `prisma migrate dev`/`deploy` sẽ không còn tự ý
#   gộp các bảng này vào migration khác nữa (tránh lặp lại lỗi P3009 /
#   "relation already exists" đã gặp).
#
# NGUYÊN TẮC AN TOÀN (đọc kỹ trước khi chạy):
#   1. LUÔN chạy trên DB LOCAL trước để kiểm tra migration.sql sinh ra đúng ý.
#   2. CHỈ sau khi xác nhận ổn ở local, mới lặp lại đúng các bước này nhắm
#      vào DATABASE_URL production — và nên có người thứ 2 xem lại trước khi
#      chạy `migrate resolve` trên production (đây là thao tác ghi vào lịch
#      sử migration của DB thật, không thể tự động rollback).
#   3. KHÔNG chạy song song với người khác đang deploy — báo trước trong
#      group trước khi đụng vào production.
#   4. Sau bước này mới được tạo migration mới (VD: add_vector_embedding).
#
# CÁCH DÙNG:
#   chmod +x baseline-orphan-tables.sh
#   ./baseline-orphan-tables.sh <ten-migration-baseline>
#
#   Ví dụ:
#   ./baseline-orphan-tables.sh baseline_booking_trainer_tables
set -e
MIGRATION_NAME="${1:-baseline_orphan_tables}"
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Chưa set DATABASE_URL."
  echo "   Local:      export DATABASE_URL=\"postgresql://.../gym_management\""
  echo "   Production: export DATABASE_URL=\"<connection string từ Render → Environment>\""
  exit 1
fi
echo "🔎 Bước 0 — Kiểm tra trạng thái migration hiện tại..."
npx prisma migrate status || true
echo ""
read -p "👉 Output ở trên KHÔNG được có dòng 'failed'. Gõ 'yes' để tiếp tục: " CONFIRM_STATUS
if [ "$CONFIRM_STATUS" != "yes" ]; then
  echo "🛑 Dừng lại. Xử lý phần failed trước (xem SAFE_MIGRATION_GUIDE.md mục 5)."
  exit 1
fi
echo ""
echo "🔎 Bước 1 — So sánh schema.prisma với DB thật (chỉ đọc, không ghi gì)..."
echo "   (Xem kỹ phần lệch để chắc chắn CHỈ có Booking/TrainerProfile/"
echo "    TrainerSchedule/TrainerCheckIn/User.emailVerified... — không có gì lạ khác)"
npx prisma db pull --print > /tmp/db_pull_preview.prisma 2>&1 || true
echo "   → Đã lưu bản xem trước tại /tmp/db_pull_preview.prisma, mở file này để đối chiếu."
echo ""
read -p "👉 Đã đối chiếu xong và chỉ thấy đúng các bảng orphan đã biết? Gõ 'yes' để tiếp tục: " CONFIRM_DIFF
if [ "$CONFIRM_DIFF" != "yes" ]; then
  echo "🛑 Dừng lại. Đừng baseline khi chưa chắc chắn phạm vi lệch."
  exit 1
fi
echo ""
echo "📝 Bước 2 — Tạo migration file (KHÔNG tự chạy vào DB)..."
npx prisma migrate dev --create-only --name "$MIGRATION_NAME"
MIGRATION_DIR=$(find prisma/migrations -maxdepth 1 -type d -name "*_${MIGRATION_NAME}" | sort | tail -n 1)
MIGRATION_FILE="$MIGRATION_DIR/migration.sql"
if [ ! -f "$MIGRATION_FILE" ]; then
  echo "❌ Không tìm thấy file migration vừa tạo ở $MIGRATION_FILE — kiểm tra tay."
  exit 1
fi
echo ""
echo "⚠️  QUAN TRỌNG: file vừa sinh ra ($MIGRATION_FILE) đang chứa lệnh CREATE TABLE"
echo "   cho các bảng ĐÃ TỒN TẠI SẴN trong DB. Cần XOÁ TRẮNG nội dung file này"
echo "   (để lại comment cho dễ hiểu), vì mục đích chỉ là ghi nhận lịch sử,"
echo "   không phải tạo bảng mới lần nữa."
echo ""
echo "   Nội dung hiện tại của file:"
echo "   -----------------------------------------"
cat "$MIGRATION_FILE"
echo "   -----------------------------------------"
echo ""
read -p "👉 Đã đọc kỹ nội dung trên, xác nhận đúng là các bảng orphan đã biết? Gõ 'yes' để xoá trắng file: " CONFIRM_EMPTY
if [ "$CONFIRM_EMPTY" != "yes" ]; then
  echo "🛑 Dừng lại, không xoá gì. Kiểm tra lại thủ công file $MIGRATION_FILE."
  exit 1
fi
cat > "$MIGRATION_FILE" << 'EOF'
-- Baseline migration: các bảng/cột dưới đây đã tồn tại sẵn trong DB
-- (được tạo trước đó bằng `prisma db push` hoặc thao tác tay, không qua
-- migration chính thức). Migration này CHỈ ghi nhận lịch sử, KHÔNG chạy
-- lại DDL, để tránh lỗi "relation already exists" cho các lần
-- `migrate deploy` sau này.
--
-- Phạm vi baseline: Booking, TrainerProfile, TrainerSchedule,
-- TrainerCheckIn, và các cột mới trên User (emailVerified, ...).
-- (Không cần chạy SQL gì ở đây — bảng đã tồn tại.)
EOF
echo "✅ Đã ghi nội dung baseline (rỗng) vào $MIGRATION_FILE"
echo ""
echo "📌 Bước 3 — Đánh dấu migration này là 'đã áp dụng' (không chạy SQL thật)..."
npx prisma migrate resolve --applied "$(basename "$MIGRATION_DIR")"
echo ""
echo "🔎 Bước 4 — Verify lại trạng thái cuối cùng..."
npx prisma migrate status
echo ""
echo "✅ XONG. Nếu output trên là 'Database schema is up to date!' (hoặc chỉ còn"
echo "   đúng những migration bạn CHỦ ĐỘNG chưa deploy) — an toàn để tiếp tục."
echo "   Nếu chạy trên LOCAL và mọi thứ ổn, lặp lại đúng script này với"
echo "   DATABASE_URL production (nhờ người thứ 2 review trước khi chạy)."
echo ""
echo "👉 Sau bước này mới được tạo migration mới, ví dụ:"
echo "   npx prisma migrate dev --name add_vector_embedding"