import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FRONTEND_URL = process.env.FRONTEND_URL_FOR_EMAIL || process.env.FRONTEND_URL || "http://localhost:3000";

export const sendVerificationEmail = async (
    email: string,
    fullName: string,
    token: string,
): Promise<void> => {
    const verifyLink = `${FRONTEND_URL}/verify-email?token=${token}`;

    const { data, error } = await resend.emails.send({
        from: "IronFit Pro <onboarding@resend.dev>",
        to: email,
        subject: "Xác nhận tài khoản IronFit Pro",
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                <h2>Chào ${fullName},</h2>
                <p>Cảm ơn bạn đã đăng ký tài khoản tại IronFit Pro. Vui lòng bấm nút bên dưới để xác nhận email và kích hoạt tài khoản:</p>
                <a href="${verifyLink}" style="display:inline-block; background:#f97316; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; margin:16px 0;">
                    Xác nhận email
                </a>
                <p style="color:#888; font-size:13px;">Liên kết có hiệu lực trong 24 giờ. Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email.</p>
            </div>
        `,
    });

    if (error) {
        console.error("❌ Resend error:", error);
        throw new Error(`Failed to send verification email: ${error.message}`);
    }

    console.log("✅ Email sent, Resend id:", data?.id);
};