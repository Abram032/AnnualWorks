import React from 'react';
import { useReview } from '../../shared/hooks/ReviewHooks';
import { getTheme, IButtonStyles, IconButton, Modal, IIconProps, Stack, StackItem, Label, IStackStyles, FontSizes, useTheme, IModalStyles, mergeStyles } from '@fluentui/react';
import { Loader } from '../loader/loader';

interface ReviewModalProps {
  guid: string,
  person: string,
  isModalVisible: boolean,
  setModalVisible: (value: boolean) => void,
}

export const ReviewModal: React.FC<ReviewModalProps> = (props) => {
  const [review, isFetching] = useReview(props.guid);
  const theme = useTheme();

  const loader = (
    <Loader label='Ładowanie...' size='medium' />
  );

  const content = (): React.ReactNode => {
    const qnas = review?.qnAs.map((qna, index) => (
      <>
        <Label>{index + 1}. {qna.question.text}</Label>
        <p>{qna.answer}</p>
      </>
    ));
    return (
      <StackItem>
        <Label style={{fontSize: FontSizes.size20}}>Recenzja - {props.person}</Label>
        {qnas}
        <Label>Ocena: {review?.grade}</Label>
      </StackItem>
    )
  };

  const cancelIcon: IIconProps = { iconName: 'Cancel' };
  const iconButtonStyles: Partial<IButtonStyles> = {
    root: {
      color: theme.palette.neutralPrimary,
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
  };
  const contentStyles: Partial<IStackStyles> = {
    root: {
      padding: '2em',
    }
  };
  const scrollableContent = mergeStyles({
    maxHeight: '100%',
  });

  return (
    <Modal
        isOpen={props.isModalVisible}
        className='review-modal'
      >
        <Stack horizontalAlign="end" horizontal>
          <StackItem styles={{ root: { marginLeft: "auto"} }}>
            <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={() => props.setModalVisible(false)}
            />
          </StackItem>
        </Stack>
        <Stack styles={contentStyles}>
          {!isFetching ? content() : loader}
        </Stack>
      </Modal>
  );
};

export default ReviewModal;