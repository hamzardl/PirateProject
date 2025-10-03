export interface User {
  id: string;         // ← même si c’est un GUID côté backend
  userName: string;
  password: string;
}
export interface userDTO {
  userName: string;
  password: string;
  isAdmin:boolean;
}