export type UserClaims = {
  Id: string;
  Name: string;
  Email: string;
  IsParticipant: string;
  IsLecturer: string;
  IsAdmin: string;
  IsCustom: string;
  AvatarUrl: string;
  iss: string;
  exp: number;
  nbf: number;
  iat: number;
};

export default UserClaims;