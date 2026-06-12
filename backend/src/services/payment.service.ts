import crypto from 'crypto';
import axios from 'axios';
import qs from 'qs';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/errors';

// ─── VNPay ───────────────────────────────────────────

function sortObject(obj: Record<string, string>) {
  const sorted: Record<string, string> = {};
  Object.keys(obj).sort().forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

const createVNPayUrl = async (
  userId: string,
  planId: string,
  amount: number,
  ipAddr: string
): Promise<{ paymentUrl: string; paymentId: string }> => {
  const plan = await prisma.membershipPlan.findFirst({
    where: { id: planId, isActive: true },
  });
  if (!plan) throw new AppError(404, 'PAYMENT_001: Plan not found');

  const existing = await prisma.userMembership.findFirst({
    where: { userId, status: 'ACTIVE' },
  });
  if (existing) throw new AppError(400, 'PAYMENT_002: User already has active membership');

  // Tao payment record voi status PENDING
  const payment = await prisma.payment.create({
    data: {
      userId,
      membershipPlanId: planId,
      amount,
      currency: 'VND',
      status: 'PENDING',
      paymentMethod: 'VNPAY',
      description: `Mua goi ${plan.name}`,
    },
  });

  const date = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const createDate = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;

  const params: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: process.env.VNPAY_TMN_CODE!,
    vnp_Amount: (amount * 100).toString(),
    vnp_CurrCode: 'VND',
    vnp_TxnRef: payment.id,
    vnp_OrderInfo: `Mua goi ${plan.name} - IronFit Pro`,
    vnp_OrderType: 'other',
    vnp_Locale: 'vn',
    vnp_ReturnUrl: process.env.VNPAY_RETURN_URL!,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  const sorted = sortObject(params);
  const signData = qs.stringify(sorted, { encode: false });
  const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET!);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  const paymentUrl = `${process.env.VNPAY_URL}?${signData}&vnp_SecureHash=${signed}`;

  return { paymentUrl, paymentId: payment.id };
};

const verifyVNPayReturn = async (
  query: Record<string, string>
): Promise<{ success: boolean; paymentId: string }> => {
  const secureHash = query.vnp_SecureHash;
  const params = { ...query };
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  const sorted = sortObject(params);
  const signData = qs.stringify(sorted, { encode: false });
  const hmac = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET!);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  const paymentId = query.vnp_TxnRef;
  const responseCode = query.vnp_ResponseCode;
  const isValid = signed === secureHash;
  const isSuccess = isValid && responseCode === '00';

  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      transactionId: query.vnp_TransactionNo || null,
    },
  });

  // Neu thanh toan thanh cong, tao UserMembership
  if (isSuccess) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { user: true },
    });

    if (payment) {
      const plan = await prisma.membershipPlan.findUnique({
        where: { id: payment.membershipPlanId },
      });

      if (plan) {
        const startDate = new Date();
        const expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + plan.duration);

        await prisma.userMembership.upsert({
          where: { userId: payment.userId },
          update: {
            planId: plan.id,
            startDate,
            expiryDate,
            status: 'ACTIVE',
            aiUsageCount: 0,
            aiDailyCount: 0,
          },
          create: {
            userId: payment.userId,
            planId: plan.id,
            startDate,
            expiryDate,
            status: 'ACTIVE',
          },
        });
      }
    }
  }

  return { success: isSuccess, paymentId };
};

// ─── MoMo ────────────────────────────────────────────

const createMoMoUrl = async (
  userId: string,
  planId: string,
  amount: number
): Promise<{ paymentUrl: string; paymentId: string }> => {
  const plan = await prisma.membershipPlan.findFirst({
    where: { id: planId, isActive: true },
  });
  if (!plan) throw new AppError(404, 'PAYMENT_001: Plan not found');

  const existing = await prisma.userMembership.findFirst({
    where: { userId, status: 'ACTIVE' },
  });
  if (existing) throw new AppError(400, 'PAYMENT_002: User already has active membership');

  const payment = await prisma.payment.create({
    data: {
      userId,
      membershipPlanId: planId,
      amount,
      currency: 'VND',
      status: 'PENDING',
      paymentMethod: 'MOMO',
      description: `Mua goi ${plan.name}`,
    },
  });

  const partnerCode = process.env.MOMO_PARTNER_CODE!;
  const accessKey = process.env.MOMO_ACCESS_KEY!;
  const secretKey = process.env.MOMO_SECRET_KEY!;
  const orderId = payment.id;
  const orderInfo = `Mua goi ${plan.name} - IronFit Pro`;
  const redirectUrl = process.env.MOMO_RETURN_URL!;
  const ipnUrl = process.env.MOMO_IPN_URL!;
  const requestId = orderId;
  const requestType = 'payWithMethod';
  const extraData = '';

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  const body = {
    partnerCode, accessKey, requestId, amount, orderId,
    orderInfo, redirectUrl, ipnUrl, extraData,
    requestType, signature, lang: 'vi',
  };

  const response = await axios.post(process.env.MOMO_ENDPOINT!, body);
  const paymentUrl = response.data.payUrl;

  return { paymentUrl, paymentId: payment.id };
};

const verifyMoMoWebhook = async (
  body: Record<string, unknown>
): Promise<{ success: boolean }> => {
  const secretKey = process.env.MOMO_SECRET_KEY!;
  const accessKey = process.env.MOMO_ACCESS_KEY!;

  const { orderId, requestId, amount, orderInfo, orderType, transId,
    resultCode, message, payType, responseTime, extraData, signature } = body as Record<string, string>;

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${process.env.MOMO_PARTNER_CODE}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
  const expectedSignature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  const isValid = signature === expectedSignature;
  const isSuccess = isValid && resultCode === '0';

  await prisma.payment.update({
    where: { id: orderId },
    data: {
      status: isSuccess ? 'SUCCESS' : 'FAILED',
      transactionId: transId || null,
    },
  });

  if (isSuccess) {
    const payment = await prisma.payment.findUnique({ where: { id: orderId } });
    if (payment) {
      const plan = await prisma.membershipPlan.findUnique({ where: { id: payment.membershipPlanId } });
      if (plan) {
        const startDate = new Date();
        const expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + plan.duration);

        await prisma.userMembership.upsert({
          where: { userId: payment.userId },
          update: { planId: plan.id, startDate, expiryDate, status: 'ACTIVE', aiUsageCount: 0, aiDailyCount: 0 },
          create: { userId: payment.userId, planId: plan.id, startDate, expiryDate, status: 'ACTIVE' },
        });
      }
    }
  }

  return { success: isSuccess };
};

const getPaymentHistory = async (userId: string) => {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const paymentService = {
  createVNPayUrl,
  verifyVNPayReturn,
  createMoMoUrl,
  verifyMoMoWebhook,
  getPaymentHistory,
};