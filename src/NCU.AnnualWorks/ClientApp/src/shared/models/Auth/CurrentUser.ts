export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  isParticipant: boolean;
  isLecturer: boolean;
  isAdmin: boolean;
  isCustom: boolean;
  avatarUrl: string;
};

export default CurrentUser;