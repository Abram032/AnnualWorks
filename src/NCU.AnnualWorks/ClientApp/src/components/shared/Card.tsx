import { IStackTokens, Stack } from '@fluentui/react';
import React from 'react';
import { Tile } from '../../Components'

export const Card: React.FC = (props) => {
  return (
    <Tile
      padding='0'
      elevation={16}
    >
      {props.children}
    </Tile>
  )
}

export const CardBody: React.FC = (props) => {
  return (
    <Stack tokens={bodyTokens} horizontalAlign="center">
      {props.children}
    </Stack>
  )
}

export const CardFooter: React.FC = (props) => {
  return (
    <Stack tokens={footerTokens} horizontalAlign="center">
      {props.children}
    </Stack>
  )
}

export const CardFooterIcons: React.FC = (props) => {
  return (
    <Stack tokens={footerIcons} horizontal horizontalAlign="center">
      {props.children}
    </Stack>
  )
}

//#region Styles

const bodyTokens: IStackTokens = { childrenGap: 15, padding: '1em' };
const footerTokens: IStackTokens = { childrenGap: 15, padding: '0 1em 1em 1em' };
const footerIcons: IStackTokens = { childrenGap: 15, padding: '0 1em 1em 1em' };

//#endregion Styles