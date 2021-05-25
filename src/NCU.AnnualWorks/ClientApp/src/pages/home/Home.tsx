import React, { useContext } from "react";
import { IStackTokens, Label, PrimaryButton, Stack } from "@fluentui/react";
import Tile from '../../components/tile/tile';
import ThesisList from '../../components/thesisList/thesisList';
import { RouteNames } from "../../shared/consts/RouteNames";
import { useAuthoredTheses, usePromotedTheses, useReviewedTheses, useCurrentTheses } from "../../shared/hooks/ThesisHooks";
import Loader from "../../components/loader/loader";
import { AuthenticationContext } from "../../shared/providers/AuthenticationProvider";
import { Redirect, useHistory } from "react-router";

export const Home: React.FC = () => {
  const history = useHistory();
  const authContext =  useContext(AuthenticationContext);
  const currentUser = authContext.currentUser;
  const [currentTheses, curentThesesFetching] = useCurrentTheses();
  const [authoredTheses, authoredThesesFetching] = useAuthoredTheses();
  const [promotedTheses, promotedThesesFetching] = usePromotedTheses();
  const [reviewedTheses, reviewedThesesFetching] = useReviewedTheses();

  if(curentThesesFetching || authoredThesesFetching || promotedThesesFetching || reviewedThesesFetching) {
    return <Loader size='medium' label='Ładowanie...' />
  } else {
    if(!currentTheses || !authoredTheses || !promotedTheses || !reviewedTheses) {
      return <Redirect to={RouteNames.error} />
    }
  }

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
    if(!currentUser?.isLecturer) {
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
        <Label>Termin końcowy: 20.09.2021</Label>
      </Stack>
      {authoredList()}
      {promotedList()}
      {reviewedList()} 
      <ThesisList title='Semestr letni 2020/2021' items={currentTheses} />
    </Tile>
  );
};

export default Home;
