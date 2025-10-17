export interface User {
  id: string;         
  userName: string;
  password: string;
}
export interface userDTO {
  userName: string;
  password: string;
  isAdmin:boolean;
}