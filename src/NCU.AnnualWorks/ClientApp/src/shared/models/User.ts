export type User = {
  id: string;
  name: string;
  email: string;
  accessType: 'Unknown' | 'Default' | 'Employee' | 'Admin';
  avatarUrl: string;
};

export default User;