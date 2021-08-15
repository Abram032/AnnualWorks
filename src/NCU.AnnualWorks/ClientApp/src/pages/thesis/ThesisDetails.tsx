import { CommandBar, DetailsRow, FontSizes, IColumn, ICommandBarItemProps, IconButton, IStackTokens, Label, Link, mergeStyles, MessageBar, MessageBarType, PrimaryButton, SelectionMode, Stack, StackItem } from '@fluentui/react';
import React from 'react';
import { Tile, Loader, ReviewModal, addActions, editGradeAction, ThesisGradeConfirmDialog } from '../../Components';
import { RouteNames } from '../../shared/Consts';
import { useCurrentUser, useThesis } from '../../shared/Hooks';
import { useBoolean } from '@fluentui/react-hooks';
import { Redirect } from 'react-router-dom';
import { CurrentUser, Review, Thesis, ThesisActions, User } from '../../shared/Models';

interface ThesisDetailsProps {
  guid: string
}

export const ThesisDetails: React.FC<ThesisDetailsProps> = (props) => {
  const currentUser = useCurrentUser();
  const [thesis, thesisFetching] = useThesis(props.guid);
  const [isPromoterReviewVisible, { toggle: toggleIsPromoterReviewVisible }] = useBoolean(false);
  const [isReviewerReviewVisible, { toggle: toggleIsReviewerReviewVisible }] = useBoolean(false);
  const [confirmDialogIsVisible, { toggle: toggleConfirmDialogIsVisible }] = useBoolean(false);

  if (thesisFetching) {
    return <Loader size='medium' label={"Ładowanie..."} />
  }

  if (!thesis || !currentUser) {
    return <Redirect to={RouteNames.error} />
  }

  return (
    <Stack className={containerStyles} tokens={containerStackTokens}>
      <Tile title={thesis.title}>
        {thesis.promoterReview?.grade && thesis.reviewerReview?.grade && !thesis.grade ? gradeConflictMessageBar : null}
        <ThesisGradeConfirmDialog guid={thesis.guid} isVisible={confirmDialogIsVisible} toggleIsVisible={toggleConfirmDialogIsVisible} />
        {/* Due to a bug, command bar cannot be put inside a flexbox https://github.com/microsoft/fluentui/issues/16268 */}
        <Stack>
          <CommandBar
            className='theses-simple-list-actions'
            items={getThesisActions(thesis, toggleConfirmDialogIsVisible)}
          />
        </Stack>
        <Stack tokens={stackTokens}>
          <Label>Dodana: {new Date(thesis.createdAt!).toLocaleDateString()}</Label>
          <Label>
            {thesis.thesisAuthors.length === 1 ? "Autor" : "Autorzy"}: {thesis.thesisAuthors.map(p => `${p.firstName} ${p.lastName}`).join(', ')}
          </Label>
        </Stack>
        <Stack tokens={stackTokens}>
          <Label style={{ fontSize: FontSizes.size20 }}>Abstrakt:</Label>
          <p>{thesis.abstract}</p>
          <Label style={{ fontSize: FontSizes.size20 }}>Słowa kluczowe:</Label>
          <p>{thesis.thesisKeywords.map(k => k.text).join(', ')}</p>
          <Label style={{ fontSize: FontSizes.size20 }}>Recenzja promotora:</Label>
          <DetailsRow
            className={rowStyles}
            selectionMode={SelectionMode.none}
            itemIndex={0}
            item={getReviewDetailRow(props.guid, thesis.actions, currentUser, thesis.promoter, toggleIsPromoterReviewVisible, thesis.promoterReview)}
            columns={columns}
            onRenderItemColumn={onRenderItemColumn}
          />
          {getReviewModal(thesis.promoter, isPromoterReviewVisible, toggleIsPromoterReviewVisible, thesis.promoterReview)}
          <Label style={{ fontSize: FontSizes.size20 }}>Recenzja recenzenta:</Label>
          <DetailsRow
            className={rowStyles}
            selectionMode={SelectionMode.none}
            itemIndex={0}
            item={getReviewDetailRow(props.guid, thesis.actions, currentUser, thesis.reviewer, toggleIsReviewerReviewVisible, thesis.reviewerReview)}
            columns={columns}
            onRenderItemColumn={onRenderItemColumn}
          />
          {getReviewModal(thesis.reviewer, isReviewerReviewVisible, toggleIsReviewerReviewVisible, thesis.reviewerReview)}
          <Label style={{ fontSize: FontSizes.size20 }}>Ocena końcowa: {thesis.grade ?? "Brak oceny"}</Label>
        </Stack>
      </Tile>
      <Stack horizontal tokens={stackTokens}>
        <StackItem>
          <PrimaryButton href={RouteNames.root}>Powrót do listy prac</PrimaryButton>
        </StackItem>
      </Stack>
    </Stack>
  );
}

export default ThesisDetails;

//#region Styles

const stackTokens: IStackTokens = { childrenGap: 10 };
const containerStackTokens: IStackTokens = { childrenGap: 15 };

const containerStyles = mergeStyles({
  width: '100%'
});

const rowStyles = mergeStyles({
  alignItems: 'center'
});

const iconStyles = mergeStyles({
  fontWeight: '600!important'
});

//#endregion

//#region Messages

const gradeConflictMessageBar = (
  <Stack tokens={stackTokens}>
    <MessageBar messageBarType={MessageBarType.blocked} isMultiline>
      Oceny wystawione w recenzjach nie pozwalają na wyliczenie średniej, która może zostać wpisana do systemu USOS.
      Skontaktuj się z promotorem lub recenzentem i wspólnie ustalcie końcową ocenę pracy.
      Ostatecznie ocena musi zostać zatwierdzona w systemie przez promotora przy wykorzystaniu akcji 'wystaw ocenę'.
    </MessageBar>
  </Stack>
);

//#endregion

//#region Review Actions

const getReviewActions = (currentUser: CurrentUser, user: User, thesisGuid: string, allowedActions: ThesisActions, review?: Review) => {
  if (user.usosId === currentUser.id) {
    if (allowedActions.canAddReview) {
      return <IconButton iconProps={{ iconName: 'PageAdd', className: `${iconStyles}` }} href={RouteNames.addReviewPath(thesisGuid)} />
    } else if (review && allowedActions.canEdit) {
      return <IconButton iconProps={{ iconName: 'PageEdit', className: `${iconStyles}` }} href={RouteNames.editReviewPath(thesisGuid, review.guid!)} />
    } else {
      return null;
    }
  }
};

//#endregion

//#region Thesis Actions 

const getThesisActions = (thesis: Thesis, toggleGradeConfrimDialog: () => void): ICommandBarItemProps[] => {
  //Adding available actions
  const actionItems: ICommandBarItemProps[] = addActions(thesis, false);

  if (thesis.actions.canEditGrade) {
    actionItems.push(editGradeAction({
      iconOnly: false,
      onClick: toggleGradeConfrimDialog
    }))
  }

  return actionItems;
}

//#endregion

//#region Render Column Item

const columns: IColumn[] = [
  //{ key: 'action', name: 'Akcja', fieldName: 'action', minWidth: 50, maxWidth: 50 },
  { key: 'name', name: 'Imie i nazwisko', fieldName: 'name', minWidth: 200, maxWidth: 500 },
  { key: 'grade', name: 'Ocena', fieldName: 'grade', minWidth: 200, maxWidth: 500 },
];

const onRenderItemColumn = (
  item: any,
  itemIndex?: number,
  column?: IColumn
): React.ReactNode => {
  switch (column?.key) {
    case 'action':
      return item.action
    case 'name':
      if (item.showModal) {
        return <Link style={{ fontSize: FontSizes.size14 }} onClick={item.showModal}>{item.name}</Link>
      } else {
        return <Label>{item.name}</Label>
      }
    case 'grade':
      return <Label>Ocena: {item.grade}</Label>
    default:
      return null;
  }
}

//#endregion

//#region Review Modal

const getReviewModal = (user: User, isVisible: boolean, toggleIsVisible: () => void, review?: Review) => {
  return !review?.guid ? null :
    <ReviewModal
      guid={review.guid!}
      person={`${user.firstName} ${user.lastName}`}
      isModalVisible={isVisible}
      setModalVisible={toggleIsVisible}
    />
};

//#endregion

//#region Review Details Row

const getReviewDetailRow = (
  thesisGuid: string,
  thesisActions: ThesisActions,
  currentUser: CurrentUser,
  user: User,
  toggleModalVisible: () => void,
  review?: Review) => {

  return {
    guid: review?.guid,
    name: `${user.firstName} ${user.lastName}`,
    grade: review?.grade ?? "Brak oceny",
    action: getReviewActions(currentUser, user, thesisGuid, thesisActions, review),
    showModal: review ? toggleModalVisible : undefined
  };
}

//#endregion