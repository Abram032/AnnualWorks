import React, { useContext } from "react";
import { IStackTokens, Label, PrimaryButton, Stack } from "@fluentui/react";
import Tile from '../../components/Tile';
import ThesisList from '../../components/thesisList/ThesisList';
import { RouteNames } from "../../shared/consts/RouteNames";
import { useAuthoredTheses, usePromotedTheses, useReviewedTheses, useCurrentTheses } from "../../shared/hooks/ThesisHooks";
import Loader from "../../components/loader/Loader";
import { AuthenticationContext } from "../../shared/providers/AuthenticationProvider";
import { Redirect, useHistory } from "react-router";
import { useDeadline } from "../../shared/hooks/DeadlineHooks";
import { useCurrentTerm } from "../../shared/hooks/TermsHooks";

export const Home: React.FC = () => {
  const history = useHistory();
  const deadline = useDeadline();
  const term = useCurrentTerm();
  const authContext =  useContext(AuthenticationContext);
  const currentUser = authContext.currentUser;
  const [currentTheses, curentThesesFetching] = useCurrentTheses();
  const [authoredTheses, authoredThesesFetching] = useAuthoredTheses();
  const [promotedTheses, promotedThesesFetching] = usePromotedTheses();
  const [reviewedTheses, reviewedThesesFetching] = useReviewedTheses();

  if(curentThesesFetching || authoredThesesFetching || promotedThesesFetching || reviewedThesesFetching || !deadline || !term) {
    return <Loader size='medium' label='Ładowanie...' />
  } 
  // else {
  //   if(!currentTheses || !authoredTheses || !promotedTheses || !reviewedTheses) {
  //     return <Redirect to={RouteNames.error} />
  //   }
  // }

  const stackTokens: IStackTokens = { childrenGap: 25 }

  const authoredList = (): React.ReactNode => {
    if(!currentUser?.isParticipant) {
      return null;
    }
    return <ThesisList title='Moje prace' items={authoredTheses} isCollapsed={false}/>
  };

  const promotedList = (): React.ReactNode => {
    if(!currentUser?.isLecturer) {
      return null;
    }
    return <ThesisList title='Promowane prace' items={promotedTheses} isCollapsed={false}/>
  };

  const reviewedList = (): React.ReactNode => {
    if(!currentUser?.isLecturer && !currentUser?.isCustom && !currentUser?.isAdmin) {
      return null;
    }
    return <ThesisList title='Recenzowane prace' items={reviewedTheses} isCollapsed={false}/>
  };

  const addThesis = (): React.ReactNode => {
    if(!currentUser?.isLecturer || deadline < new Date()) {
      return null;
    }
    return <PrimaryButton 
      //href={RouteNames.addThesis} 
      onClick={() => history.push(RouteNames.addThesis)}
      >
        Dodaj pracę
      </PrimaryButton>
  }

  return (
    <Tile title='Lista prac rocznych'>
      <Stack horizontal horizontalAlign='end' tokens={stackTokens}>
        {addThesis()}
        <Label>{`Termin końcowy: ${deadline.toLocaleDateString()}`}</Label>
      </Stack>
      {authoredList()}
      {promotedList()}
      {reviewedList()} 
      <ThesisList title={term.names.pl} items={currentTheses} />
    </Tile>
  );
};

export default Home;
