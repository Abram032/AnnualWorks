import { CommandBar, IStackTokens, Stack } from '@fluentui/react';
import React from 'react';
import Tile from '../../components/tile/Tile';
import { viewAction, downloadAction, printAction } from '../../components/thesisActions/ThesisActions';

export const Review: React.FC = () => {
  const actionItems = [
    viewAction({iconOnly: false}),
    downloadAction({iconOnly: false}),
    printAction({iconOnly: false}),
  ];

  const stackTokens: IStackTokens = { childrenGap: 15 };

  return (
    <Stack style={{ width: '100%' }} tokens={stackTokens}>
      <Tile title='Recenzja pracy - Tytuł pracy 1'>
        <CommandBar
          className='theses-simple-list-actions'
          items={actionItems}
        />
        
      </Tile>
    </Stack>
  )
}

export default Review;