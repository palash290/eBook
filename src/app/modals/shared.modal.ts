import { Author } from "./followedAuthor.modal";

export interface Book {
      type: number;
      books: CategoryBook[];
      quantity: any;
      id: number;
      title: string;
      description: string;
      userId: number;
      authorId: number;
      price: number;
      costPrice: number;
      stock: number;
      coverImage: string;
      publishedAt: string;
      pdfUrl: string;
      audioUrl: string;
      createdAt: string;
      updatedAt: string;
      totalViews: number;
      isFavorite: boolean;
      author?: Author;
      bookMedia: BookMedia[];
}

export interface BookMedia {
      id: number;
      bookId: number;
      mediaUrl: string;
      type: string;
      createdAt: string;
      updatedAt: string;
}

export interface User {
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
      following: Follow[];
      isFollowed: boolean
      facebook: string;
      genres: string;
      createdAt: string;
      updatedAt: string;
      books: Book[];
      publishedCount: number;
      followersCount: number;
      AuthorCategory: any[];
}

export interface Category {
      id: number;
      name: string;
      books: CategoryBook[];
}

export interface CategoryBook {
      id: number;
      bookId: number;
      categoryId: number;
      book: Book;
      category: Category;
}

export interface Follow {
      id: number;
      followerId: number;
      followingId: number;
      isFollowed: boolean;
      status: number;
      createdAt: string;
      updatedAt: string;
}