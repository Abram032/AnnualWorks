import { CommandBar, DetailsRow, FontSizes, IColumn, ICommandBarItemProps, IconButton, IStackTokens, Label, Link, mergeStyles, MessageBar, MessageBarType, PrimaryButton, SelectionMode, Stack, StackItem } from '@fluentui/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Tile, Loader, ReviewModal, addActions, editGradeAction, ThesisGradeConfirmDialog } from '../../Components';
import { RouteNames } from '../../shared/Consts';
import { useCurrentUser, useThesis } from '../../shared/Hooks';
import { useBoolean } from '@fluentui/react-hooks';
import { Redirect } from 'react-router-dom';
import { CurrentUser, Review, ThesisActions, User } from '../../shared/Models';

interface ThesisDetailsProps {
  guid: string
}

export const ThesisDetails: React.FC<ThesisDetailsProps> = (props) => {
  const history = useHistory();
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

  //Adding available actions
  const actionItems: ICommandBarItemProps[] = addActions(thesis, false);
  if (thesis.actions.canEditGrade) {
    actionItems.push(editGradeAction({
      iconOnly: false,
      onClick: toggleConfirmDialogIsVisible
    }))
  }

  const columns: IColumn[] = [
    //{ key: 'action', name: 'Akcja', fieldName: 'action', minWidth: 50, maxWidth: 50 },
    { key: 'name', name: 'Imie i nazwisko', fieldName: 'name', minWidth: 200, maxWidth: 500 },
    { key: 'grade', name: 'Ocena', fieldName: 'grade', minWidth: 200, maxWidth: 500 },
  ];

  const reviewAddAction = (
    <IconButton
      iconProps={{ iconName: 'PageAdd', className: `${iconStyles}` }}
      href={RouteNames.addReviewPath(props.guid)} 
    />
  );

  const reviewEditAction = (reviewGuid: string) => (
    <IconButton
      iconProps={{ iconName: 'PageEdit', className: `${iconStyles}` }}
      href={RouteNames.editReviewPath(props.guid, reviewGuid)} 
    />
  );

  const getActions = (currentUser: CurrentUser, user: User, review: Review, allowedActions: ThesisActions) => {
    if(user.usosId === currentUser.id) {
      if(review)
      {
        
      }
    }
  }

  const getPromoterAction = () => {
    if (thesis.promoter.usosId === currentUser.id) {
      if (thesis.promoterReview && thesis.actions.canEditReview) {
        return reviewEditAction(thesis.promoterReview.guid!);
      } else if (thesis.actions.canAddReview) {
        return reviewAddAction;
      } else {
        return null;
      }
    }
  }

  const getReviewerAction = () => {
    if (thesis.reviewer.usosId === currentUser.id) {
      if (thesis.reviewerReview && thesis.actions.canEditReview) {
        return reviewEditAction(thesis.reviewerReview.guid!);
      } else if (thesis.actions.canAddReview) {
        return reviewAddAction;
      } else {
        return null;
      }
    }
  }

  const promoterReviewModal = !thesis.promoterReview?.guid ? null :
    <ReviewModal 
      guid={thesis.promoterReview.guid} 
      person={`${thesis.promoter.firstName} ${thesis.promoter.lastName}`} 
      isModalVisible={isPromoterReviewVisible} 
      setModalVisible={toggleIsPromoterReviewVisible}
    />;

  const reviewerReviewModal = !thesis.reviewerReview?.guid ? null : 
    <ReviewModal 
      guid={thesis.reviewerReview.guid} 
      person={`${thesis.reviewer.firstName} ${thesis.reviewer.lastName}`} 
      isModalVisible={isReviewerReviewVisible} 
      setModalVisible={toggleIsReviewerReviewVisible}
    />;

  const reviewerReview = {
    guid: thesis.reviewerReview?.guid,
    name: `${thesis.reviewer.firstName} ${thesis.reviewer.lastName}`,
    grade: thesis.reviewerReview?.grade ?? "Brak oceny",
    action: getReviewerAction(),
    showModal: thesis.reviewerReview ? toggleIsReviewerReviewVisible: undefined
  };

  const promoterReview = {
    guid: thesis.promoterReview?.guid,
    name: `${thesis.promoter.firstName} ${thesis.promoter.lastName}`,
    grade: thesis.promoterReview?.grade ?? "Brak oceny",
    action: getPromoterAction(),
    showModal: thesis.promoterReview ? toggleIsPromoterReviewVisible : undefined
  };

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

  return (
    <Stack className={containerStyles} tokens={containerStackTokens}>
      <Tile title={thesis.title}>
        {thesis.promoterReview?.grade && thesis.reviewerReview?.grade && !thesis.grade ? gradeConflictMessageBar : null}
        <ThesisGradeConfirmDialog guid={thesis.guid} isVisible={confirmDialogIsVisible} toggleIsVisible={toggleConfirmDialogIsVisible} />
        {/* Due to a bug, command bar cannot be put inside a flexbox https://github.com/microsoft/fluentui/issues/16268 */}
        <Stack>
          <CommandBar
            className='theses-simple-list-actions'
            items={actionItems}
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
            item={promoterReview}
            columns={columns}
            onRenderItemColumn={onRenderItemColumn}
          />
          {promoterReviewModal}
          <Label style={{ fontSize: FontSizes.size20 }}>Recenzja recenzenta:</Label>
          <DetailsRow
            className={rowStyles}
            selectionMode={SelectionMode.none}
            itemIndex={0}
            item={reviewerReview}
            columns={columns}
            onRenderItemColumn={onRenderItemColumn}
          />
          {reviewerReviewModal}
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