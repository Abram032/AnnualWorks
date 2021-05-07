import { IStackTokens, Stack, StackItem } from '@fluentui/react';
import React from 'react';
import { ThesisDetails } from '../../components/thesisDetails/ThesisDetails';

export const Thesis: React.FC = (props) => {
  const stackTokens: IStackTokens = { childrenGap: 50 }

  return (
    <Stack className='page' horizontal tokens={stackTokens}>
      <ThesisDetails />
    </Stack>
  );
}

export default Thesis;