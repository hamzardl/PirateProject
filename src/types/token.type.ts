export type TokenRecord = {
  id: string;
  username: string;
  token: string;
  issued_at: Date;
  expires_at: Date;
  revoked: boolean;
  created_at: Date ;
  updated_at: Date ;
};

