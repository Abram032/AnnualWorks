import React, { useContext } from "react";
import { IStackTokens, Label, PrimaryButton, Stack } from "@fluentui/react";
import Tile from '../../components/tile/tile';
import ThesisList from '../../components/thesisList/thesisList';
import { RouteNames } from "../../shared/consts/RouteNames";
import { useAuthoredTheses, usePromotedTheses, useReviewedTheses, useCurrentTheses } from "../../shared/hooks/ThesisHooks";
import Loader from "../../components/loader/loader";
import { AuthenticationContext } from "../../shared/providers/AuthenticationProvider";
import { AccessTypes } from "../../shared/models/Auth/AccessType";
import { useHistory } from "react-router";

export const Home: React.FC = () => {
  const history = useHistory();
  const authContext =  useContext(AuthenticationContext);
  const [currentTheses, curentThesesFetching] = useCurrentTheses();
  const [authoredTheses, authoredThesesFetching] = useAuthoredTheses();
  const [promotedTheses, promotedThesesFetching] = usePromotedTheses();
  const [reviewedTheses, reviewedThesesFetching] = useReviewedTheses();

  if(curentThesesFetching || authoredThesesFetching || promotedThesesFetching || reviewedThesesFetching) {
    return <Loader size='medium' label='Ładowanie...' />
  }

  const stackTokens: IStackTokens = { childrenGap: 25 }

  const authoredList = (): React.ReactNode => {
    if(authContext.currentUser?.accessType !== AccessTypes.Default) {
      return null;
    }
    return <ThesisList title='Moje prace' items={authoredTheses} isCollapsed={false}/>
  };

  const promotedList = (): React.ReactNode => {
    if(authContext.currentUser?.accessType === AccessTypes.Default) {
      return null;
    }
    return <ThesisList title='Promowane prace' items={promotedTheses} isCollapsed={false}/>
  };

  const reviewedList = (): React.ReactNode => {
    if(authContext.currentUser?.accessType === AccessTypes.Default) {
      return null;
    }
    return <ThesisList title='Recenzowane prace' items={reviewedTheses} isCollapsed={false}/>
  };

  return (
    <Tile title='Lista prac rocznych'>
      <Stack horizontal horizontalAlign='end' tokens={stackTokens}>
        <PrimaryButton href={RouteNames.addthesis} onClick={() => history.push(RouteNames.addthesis)}>Dodaj pracę</PrimaryButton>
        <Label>Termin końcowy: 07.05.2021</Label>
      </Stack>
      {authoredList()}
      {promotedList()}
      {reviewedList()} 
      <ThesisList title='Semestr zimowy 2020/2021' items={currentTheses} />
    </Tile>
  );
};

export default Home;
