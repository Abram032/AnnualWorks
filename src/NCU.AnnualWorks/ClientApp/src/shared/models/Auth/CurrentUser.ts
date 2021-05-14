import { AccessType } from './AccessType';

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  accessType: AccessType;
  avatarUrl: string;
};

export default CurrentUser;