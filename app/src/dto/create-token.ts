export interface RequestTokenDTO {
  userId: number;
}

export interface VerifyTokenDTO {
  userId: number;
  token: string;
}
