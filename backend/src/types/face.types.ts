export interface EnrollFaceDTO {
    userId: string;
    // Mỗi ảnh cho ra 1 descriptor 128 chiều (face-api.js). Server sẽ trung bình
    // cộng lại nếu nhận nhiều hơn 1, giống luồng "Admin đăng ký hộ bằng ảnh tĩnh"
    // ở bản MVC.
    descriptors: number[][];
}

export interface FaceProfileForKiosk {
    userId: string;
    fullName: string;
    role: "ADMIN" | "MEMBER" | "PT";
    descriptor: number[];
}

export interface EnrollableUser {
    id: string;
    fullName: string;
    email: string;
    role: "ADMIN" | "MEMBER" | "PT";
    hasProfile: boolean;
}

export interface FaceCheckInResult {
    matchedRole: "MEMBER" | "PT";
    message: string;
    // Chỉ 1 trong 2 field dưới có giá trị, tùy matchedRole
    booking?: {
        id: string;
        checkInTime: string;
    };
    trainerCheckIn?: {
        id: string;
        checkedInAt: string;
    };
}
