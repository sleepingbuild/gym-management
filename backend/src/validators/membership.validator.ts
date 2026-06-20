import { z } from "zod";

export const buyMembershipSchema = z.object({
    planId: z.string().min(1, "MEMBERSHIP_001: Plan ID is required"),
});

export type BuyMembershipRequest = z.infer<typeof buyMembershipSchema>;
