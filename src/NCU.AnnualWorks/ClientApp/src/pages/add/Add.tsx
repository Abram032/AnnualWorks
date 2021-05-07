import { IStackTokens, Stack, StackItem } from '@fluentui/react';
import React from 'react';
import { ThesisForm } from '../../components/thesisForm/ThesisForm';

export const Add: React.FC = (props) => {
  const stackTokens: IStackTokens = { childrenGap: 50 }

  return (
    <Stack className='page' tokens={stackTokens}>
      <ThesisForm />
    </Stack>
  );
}

export default Add;