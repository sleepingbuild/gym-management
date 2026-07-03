import { Role } from "@prisma/client";

export interface TokenPayload {
    userId: string;
    email: string;
    role: Role;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface RegisterDTO {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        fullName: string;
        role: Role;
        phone?: string | null;
        avatar?: string | null;
        isActive: boolean;
    };
    tokens: AuthTokens;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken?: string;
}
