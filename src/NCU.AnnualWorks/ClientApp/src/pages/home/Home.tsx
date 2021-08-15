import React from "react";
import { IStackTokens, Label, PrimaryButton, Stack } from "@fluentui/react";
import { Tile, ThesisList, Loader } from '../../Components';
import { RouteNames } from "../../shared/Consts";
import { useAuthoredTheses, usePromotedTheses, useReviewedTheses, useCurrentTheses, useDeadline, useCurrentTerm, useCurrentUser } from "../../shared/Hooks";
import { Redirect } from "react-router-dom";

export const Home: React.FC = () => {
  const currentUser = useCurrentUser();
  const [deadline, deadlineFetching] = useDeadline();
  const [currentTerm, currentTermFetching] = useCurrentTerm();
  const [currentTheses, curentThesesFetching] = useCurrentTheses();
  const [authoredTheses, authoredThesesFetching] = useAuthoredTheses();
  const [promotedTheses, promotedThesesFetching] = usePromotedTheses();
  const [reviewedTheses, reviewedThesesFetching] = useReviewedTheses();

  if(curentThesesFetching || authoredThesesFetching || promotedThesesFetching || reviewedThesesFetching || deadlineFetching || currentTermFetching) {
    return <Loader />
  };

  if(!currentUser || !deadline || !currentTerm) {
    return <Redirect to={RouteNames.error} />
  }

  const authoredList = currentUser?.isParticipant ? 
    <ThesisList title='Moje prace' items={authoredTheses} isCollapsed={false}/> : null;

  const promotedList = currentUser?.isLecturer ?
    <ThesisList title='Promowane prace' items={promotedTheses} isCollapsed={false}/> : null;

  const reviewedList = currentUser?.isLecturer || currentUser?.isCustom || currentUser?.isAdmin ?
    <ThesisList title='Recenzowane prace' items={reviewedTheses} isCollapsed={false}/> : null;

  const addThesisButton = currentUser?.isLecturer && deadline && deadline > new Date() ? 
    <PrimaryButton href={RouteNames.addThesis}>Dodaj pracę</PrimaryButton> : null;

  return (
    <Tile title='Lista prac rocznych'>
      <Stack horizontal horizontalAlign='end' tokens={stackTokens}>
        {addThesisButton}
        <Label>{`Termin końcowy: ${deadline?.toLocaleDateString()}`}</Label>
      </Stack>
      {authoredList}
      {promotedList}
      {reviewedList} 
      <ThesisList title={currentTerm?.names.pl} items={currentTheses} />
    </Tile>
  );
};

export default Home;

//#region Styles

const stackTokens: IStackTokens = { childrenGap: 25 }

//#endregion