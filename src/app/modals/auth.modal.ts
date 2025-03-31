export interface User {
      id: number;
      fullName: string;
      userName: string | null;
      email: string;
      password: string;
      about: string | null;
      otp: string | null;
      fcm_token: string | null;
      act_token: string;
      profilePic: string | null;
      avatar_url: string | null;
      numberOfFollower: number;
      numberOfFollowing: number;
      notes: string | null;
      token: string | null;
      isOnline: number;
      isVerified: boolean;
      otpExpiration: string | null;
      status: number;
      createdAt: string;
      updatedAt: string;
}

export interface LoginResponse {
      status: number;
      success: boolean;
      message: string;
      token: string;
      user: User;
}