import { DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React from 'react';

interface ThesisFormConfirmDialogProps {
  isVisible: boolean,
  toggleIsVisible: () => void,
  onConfirm: () => void,
  onSave: () => void
};

export const ThesisFormConfirmDialog: React.FC<ThesisFormConfirmDialogProps> = (props) => {
  const labelId: string = useId('ThesisFormConfirmDialogLabelId');
  const subTextId: string = useId('ThesisFormConfirmDialogSubTextId');
  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Zapis pracy',
    closeButtonAriaLabel: 'Close',
    subText: 'Czy jesteś pewien, że chcesz zapisać pracę i rozpocząć proces recenzji? Po zatwierdzeniu pierwszej recenzji nie ma możliwości dalszej edycji pracy.',
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
        }} text="Zapisz i zrecenzuj" />
        <DefaultButton onClick={() => {
          props.toggleIsVisible();
          props.onSave();
        }} text="Zapisz" />
      </DialogFooter>
    </Dialog>
  )
}