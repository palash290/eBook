export interface FollowedAuthor {
      id: number;
      followerId: number;
      followingId: number;
      isFollowed: boolean;
      status: number;
      createdAt: string;
      updatedAt: string;
      following: Author;
}

export interface Author {
      id: number;
      fullName: string;
      email: string;
      password: string;
      tagline: string;
      status: number;
      otp: string | null;
      dob: string;
      fcm_token: string | null;
      avatar_url: string;
      coverImage: string;
      act_token: string;
      isVerified: boolean;
      isOnline: number;
      token: string | null;
      bio: string | null;
      profilePic: string | null;
      instagram: string;
      facebook: string;
      genres: string;
      createdAt: string;
      updatedAt: string;
}
