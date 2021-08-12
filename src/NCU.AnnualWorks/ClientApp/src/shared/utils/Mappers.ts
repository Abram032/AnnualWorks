import { IPersonaProps, ITag } from "@fluentui/react";
import Keyword from "../models/Keyword";
import User from "../models/User";

export const mapUserToPersona = (user: User): IPersonaProps => ({
  key: user.usosId,
  text: `${user.firstName} ${user.lastName}`,
  secondaryText: user.email,
  imageUrl: user.photoUrl,
})

export const mapUsersToPersona = (users: User[]): IPersonaProps[] => 
  users.map<IPersonaProps>(u => mapUserToPersona(u));

export const mapKeywordToTag = (keyword: Keyword): ITag => ({
  key: keyword.id,
  name: keyword.text,
});

export const mapKeywordsToTags = (keywords: Keyword[]): ITag[] =>
  keywords.map<ITag>(k => mapKeywordToTag(k));

export const mapTagToKeyword = (tag: ITag): Keyword => ({
  id: isNaN(parseInt(tag.key.toString())) ? 0 : parseInt(tag.key.toString()), 
  text: tag.name 
});

export const mapTagsToKeywords = (tags: ITag[]): Keyword[] =>
  tags.map<Keyword>(t => mapTagToKeyword(t));