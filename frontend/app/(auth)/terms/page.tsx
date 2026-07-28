import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-canvas py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-display-lg font-display text-ink">IronFit Pro</h1>
          <p className="text-body text-muted">Điều khoản sử dụng</p>
        </div>

        <div className="bg-surface-card rounded-lg p-8 shadow-sm space-y-6 text-body-sm text-body">
          <p className="text-muted">Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}</p>

          <section>
            <h2 className="text-title-sm font-display text-ink mb-2">1. Chấp nhận điều khoản</h2>
            <p>
              Bằng việc đăng ký và sử dụng dịch vụ của IronFit Pro, bạn đồng ý tuân thủ các
              điều khoản được nêu trong tài liệu này. Nếu bạn không đồng ý với bất kỳ điều
              khoản nào, vui lòng không sử dụng dịch vụ.
            </p>
          </section>

          <section>
            <h2 className="text-title-sm font-display text-ink mb-2">2. Tài khoản người dùng</h2>
            <p>
              Bạn có trách nhiệm cung cấp thông tin chính xác khi đăng ký và bảo mật thông tin
              đăng nhập của mình. IronFit Pro không chịu trách nhiệm cho các thiệt hại phát
              sinh từ việc bạn để lộ thông tin tài khoản cho bên thứ ba.
            </p>
          </section>

          <section>
            <h2 className="text-title-sm font-display text-ink mb-2">3. Dịch vụ gói tập và thanh toán</h2>
            <p>
              Các gói thành viên được thanh toán trước theo chu kỳ đã chọn. IronFit Pro có
              quyền thay đổi giá gói tập với thông báo trước tới người dùng. Việc hoàn tiền
              (nếu có) sẽ tuân theo chính sách hoàn tiền được công bố riêng.
            </p>
          </section>

          <section>
            <h2 className="text-title-sm font-display text-ink mb-2">4. Sử dụng trợ lý AI</h2>
            <p>
              Thông tin tư vấn từ trợ lý AI (dinh dưỡng, lịch tập) mang tính chất tham khảo,
              không thay thế cho lời khuyên y tế hoặc huấn luyện chuyên môn trực tiếp. Người
              dùng nên tham khảo ý kiến bác sĩ hoặc huấn luyện viên trước khi áp dụng các thay
              đổi lớn về chế độ tập luyện hoặc dinh dưỡng.
            </p>
          </section>

          <section>
            <h2 className="text-title-sm font-display text-ink mb-2">5. Dữ liệu cá nhân</h2>
            <p>
              IronFit Pro thu thập và lưu trữ dữ liệu cá nhân (thông tin liên hệ, chỉ số cơ
              thể, lịch sử tập luyện) nhằm mục đích cung cấp dịch vụ. Chúng tôi cam kết không
              chia sẻ dữ liệu này cho bên thứ ba ngoài phạm vi cần thiết để vận hành dịch vụ
              (ví dụ: cổng thanh toán).
            </p>
          </section>

          <section>
            <h2 className="text-title-sm font-display text-ink mb-2">6. Quy tắc ứng xử</h2>
            <p>
              Người dùng không được sử dụng dịch vụ cho mục đích bất hợp pháp, quấy rối người
              dùng khác, hoặc cố gắng truy cập trái phép vào hệ thống. Vi phạm có thể dẫn đến
              việc khoá tài khoản mà không cần báo trước.
            </p>
          </section>

          <section>
            <h2 className="text-title-sm font-display text-ink mb-2">7. Thay đổi điều khoản</h2>
            <p>
              IronFit Pro có thể cập nhật điều khoản sử dụng theo thời gian. Việc tiếp tục sử
              dụng dịch vụ sau khi điều khoản được cập nhật đồng nghĩa với việc bạn chấp nhận
              các thay đổi đó.
            </p>
          </section>

          <p className="text-muted-soft text-xs pt-4 border-t border-hairline">
            Đây là bản điều khoản mẫu dùng cho mục đích demo/học tập, không phải tư vấn pháp
            lý chính thức. Trước khi triển khai thực tế, nên tham khảo ý kiến luật sư để đảm
            bảo tuân thủ quy định pháp luật hiện hành.
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/register" className="text-primary hover:underline text-body-sm">
            ← Quay lại đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}