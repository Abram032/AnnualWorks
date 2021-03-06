import { DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React from 'react';

interface ReviewFormConfirmDialogProps {
  isVisible: boolean,
  toggleIsVisible: () => void,
  onConfirm: () => void,
  onSave: () => void
};

export const ReviewFormConfirmDialog: React.FC<ReviewFormConfirmDialogProps> = (props) => {
  const labelId: string = useId('ReviewFormConfirmDialogLabelId');
  const subTextId: string = useId('ReviewFormConfirmDialogSubTextId');
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Zatwierdzanie recenzji',
    closeButtonAriaLabel: 'Close',
    subText: 'Czy jesteś pewien, że chcesz zatwierdzić swoją recenzję? Po zatwierdzeniu nie ma możliwości jej dalszej edycji oraz edycji pracy.',
  };
  const modalProps = React.useMemo(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: false,
    }),
    [labelId, subTextId],
  );

  return (
    <Dialog
      hidden={props.isVisible}
      onDismiss={props.toggleIsVisible}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
    >
      <DialogFooter>
        <PrimaryButton onClick={() => {
          props.toggleIsVisible();
          props.onConfirm();
        }} text="Zapisz i zatwierdź" />
        <DefaultButton onClick={() => {
          props.toggleIsVisible();
          props.onSave();
        }} text="Zapisz" />
      </DialogFooter>
    </Dialog>
  )
}