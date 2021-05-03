import { AccessType } from './AccessType';

export type User = {
  id: string;
  name: string;
  email: string;
  accessType: AccessType;
  avatarUrl: string;
};

export default User;