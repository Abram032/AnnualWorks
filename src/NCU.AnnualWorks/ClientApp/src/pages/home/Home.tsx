import React from "react";
import { IStackTokens, Label, PrimaryButton, Stack } from "@fluentui/react";
import { Tile, ThesisList, Loader } from '../../Components';
import { RouteNames } from "../../shared/Consts";
import { useAuthoredTheses, usePromotedTheses, useReviewedTheses, useCurrentTheses, useDeadline, useCurrentUser, useCurrentYear } from "../../shared/Hooks";
import { Redirect } from "react-router-dom";

export const Home: React.FC = () => {
  const currentUser = useCurrentUser();
  const [deadline, deadlineFetching] = useDeadline();
  const [currentYear, currentYearFetching] = useCurrentYear();
  const [currentTheses, curentThesesFetching] = useCurrentTheses();
  const [authoredTheses, authoredThesesFetching] = useAuthoredTheses();
  const [promotedTheses, promotedThesesFetching] = usePromotedTheses();
  const [reviewedTheses, reviewedThesesFetching] = useReviewedTheses();

  if(curentThesesFetching || authoredThesesFetching || promotedThesesFetching || reviewedThesesFetching || deadlineFetching || currentYearFetching) {
    return <Loader />
  };

  if(!currentUser || !deadline || !currentYear) {
    return <Redirect to={RouteNames.error} />
  }

  const authoredList = currentUser?.isParticipant ? 
    <ThesisList title='Moje prace' items={authoredTheses} isCollapsed={false}/> : null;

  const promotedList = currentUser?.isLecturer ?
    <ThesisList title='Promowane prace' items={promotedTheses} isCollapsed={false}/> : null;

  const reviewedList = currentUser?.isEmployee ?
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
      <ThesisList title={currentYear?.names.pl} items={currentTheses} />
    </Tile>
  );
};

export default Home;

//#region Styles

const stackTokens: IStackTokens = { childrenGap: 25 }

//#endregion