export type Gender = 0 | 1;

export interface AutoDeleteMsgDTO {
  users?: { uid: number, expires_in: number }[],
  groups?: { gid: number, expires_in: number }[],
}
export interface User {
  uid: number;
  email: string;
  name: string;
  gender: Gender;
  language?: string;
  is_admin: boolean;
  avatar_updated_at: number;
  create_by: string;
  webhook_url?: string;
  is_bot?: boolean;
}
export type UserStatus = "normal" | "frozen";
export type UserDevice = {
  device: string;
  device_token?: string;
  is_online: boolean;
};
export type BotAPIKey = {
  id: number,
  name: string,
  key: string,
  created_at: number,
  last_used: number
};

export interface UserForAdmin extends User {
  password: string;
  in_online: boolean;
  updated_at: number;
  status: UserStatus;
  online_devices: UserDevice[];
}
export interface UserForAdminDTO extends Partial<UserForAdmin> {
  id?: number;
}
export interface UserDTO extends Partial<Pick<User, "name" | "gender" | "language" | "email" | "webhook_url">> {
  password?: string
}
export interface UserCreateDTO extends Pick<User, "name" | "gender" | "language" | "email" | "webhook_url" | "is_bot" | "is_admin"> {
  password: string;
}
