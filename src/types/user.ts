export interface UserProfile {
  id: string;
  userName: string;
  profileImage?: string;
  email?: string;
}

export interface UserId {
  userId: string;
}

export interface UpsertUser {
  id: string;
  userName: string;
  email: string;
  profileImage: string;
}
