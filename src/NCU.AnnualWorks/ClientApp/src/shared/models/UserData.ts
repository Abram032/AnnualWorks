import { AccessType } from './AccessType';

export type UserData = {
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

export default UserData;