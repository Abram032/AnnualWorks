import { IPersonaProps } from "@fluentui/react";
import { User } from "../../Models";

export const mapUserToPersona = (user: User): IPersonaProps => ({
  key: user.usosId,
  text: `${user.firstName} ${user.lastName}`,
  secondaryText: user.email,
  imageUrl: user.photoUrl,
})

export const mapUsersToPersona = (users: User[]): IPersonaProps[] =>
  users.map<IPersonaProps>(u => mapUserToPersona(u));
