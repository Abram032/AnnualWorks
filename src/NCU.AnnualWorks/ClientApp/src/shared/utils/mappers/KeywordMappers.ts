import { ITag } from "@fluentui/react";
import { Keyword } from "../../Models";

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