const MAILJET_API_KEY = process.env.MAILJET_API_KEY || "";
const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY || "";
const MAILJET_SENDER_EMAIL = process.env.MAILJET_SENDER_EMAIL || "";
const MAILJET_SENDER_NAME = process.env.MAILJET_SENDER_NAME || "IronFit Pro";
const FRONTEND_URL =
    process.env.FRONTEND_URL_FOR_EMAIL ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000";

export const sendVerificationEmail = async (
    email: string,
    fullName: string,
    token: string,
): Promise<void> => {
    const verifyLink = `${FRONTEND_URL}/verify-email?token=${token}`;
    const auth = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`).toString("base64");

    const response = await fetch("https://api.mailjet.com/v3.1/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
            Messages: [
                {
                    From: { Email: MAILJET_SENDER_EMAIL, Name: MAILJET_SENDER_NAME },
                    To: [{ Email: email, Name: fullName }],
                    Subject: "Xác nhận tài khoản IronFit Pro",
                    HTMLPart: `
                        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                            <h2>Chào ${fullName},</h2>
                            <p>Cảm ơn bạn đã đăng ký tài khoản tại IronFit Pro. Vui lòng bấm nút bên dưới để xác nhận email và kích hoạt tài khoản:</p>
                            <a href="${verifyLink}" style="display:inline-block; background:#f97316; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; margin:16px 0;">
                                Xác nhận email
                            </a>
                            <p style="color:#888; font-size:13px;">Liên kết có hiệu lực trong 24 giờ. Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email.</p>
                        </div>
                    `,
                },
            ],
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("❌ Mailjet error:", response.status, errorBody);
        throw new Error(`Failed to send verification email: ${errorBody}`);
    }

    const data = await response.json();
    console.log("✅ Email sent via Mailjet:", JSON.stringify(data));
};