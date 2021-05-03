export type UserData = {
  Id: string;
  Name: string;
  Email: string;
  AccessType: 'Unknown' | 'Default' | 'Employee' | 'Admin';
  AvatarUrl: string;
  iss: string;
  exp: number;
  nbf: number;
  iat: number;
};

export default UserData;