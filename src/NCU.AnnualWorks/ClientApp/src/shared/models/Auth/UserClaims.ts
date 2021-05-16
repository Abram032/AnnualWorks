import { AccessType } from './AccessType';

export type UserClaims = {
  Id: string;
  Name: string;
  Email: string;
  AccessType: AccessType;
  AvatarUrl: string;
  iss: string;
  exp: number;
  nbf: number;
  iat: number;
};

export default UserClaims;