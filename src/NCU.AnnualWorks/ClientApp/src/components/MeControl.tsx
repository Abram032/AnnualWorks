import {
  Callout,
  DefaultButton,
  DirectionalHint,
  IStackTokens,
  Label,
  Link,
  Persona,
  PersonaSize,
  Stack,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import React from "react";
import { CurrentUser } from "../shared/Models";
import { ThemePicker } from './ThemePicker';
import { AppSettings } from '../AppSettings';
import { RouteNames } from '../shared/Consts';

interface MeControlProps {
  user: CurrentUser;
}

export const MeControl: React.FC<MeControlProps> = (props) => {
  const [isCalloutVisible, { toggle: toggleCalloutIsVisible }] = useBoolean(false);
  const meButtonId = useId('me-button-id');

  const calloutButton = (
    <DefaultButton 
        id={meButtonId}
        onClick={toggleCalloutIsVisible}
        className='me-control-button' 
        text={props.user.name}
      >
        <Persona
          imageUrl={props.user.avatarUrl}
          imageInitials={props.user.name
            .split(" ")
            .map((s) => s.charAt(0))
            .join("")}
          size={PersonaSize.size40}
        />
      </DefaultButton>
  );

  const calloutContent = (
    <Stack className='me-control-callout' tokens={stackTokens}>
      <Stack verticalAlign='center' tokens={stackTokens} horizontal>
        <Link href={AppSettings.Urls.USOS}>Przejdź do USOSa</Link>
        <DefaultButton
          className='me-control-signout'
          href={RouteNames.signOut}
          text='Wyloguj się'
        />
      </Stack>
      <Stack.Item tokens={stackTokens}>
      <Persona
          imageUrl={props.user.avatarUrl}
          text={props.user.name}
          secondaryText={props.user.email}
          imageInitials={props.user.name
            .split(" ")
            .map((s) => s.charAt(0))
            .join("")}
          size={PersonaSize.size56}
        />
      </Stack.Item>
      <Stack.Item tokens={stackTokens}>
        <Label>Personalizacja</Label>
      </Stack.Item>
      <Stack.Item tokens={stackTokens}>
        <ThemePicker />
      </Stack.Item>
      {/* <Stack.Item tokens={stackTokens}>
        <LanguagePicker />
      </Stack.Item> */}
    </Stack>
  )

  const calloutComponent = (
    <Callout
      directionalHint={DirectionalHint.bottomAutoEdge}
      onDismiss={toggleCalloutIsVisible}
      target={`#${meButtonId}`}
      isBeakVisible={false}
      gapSpace={0}
      setInitialFocus
    >
      {calloutContent}
    </Callout>
  );

  return (
    <Stack className='me-control' horizontal>
      {calloutButton}
      {isCalloutVisible ? calloutComponent : null}
    </Stack>
  )
};

export default MeControl;


//#region Styles

const stackTokens: IStackTokens = { childrenGap: 15 };

//#endregion