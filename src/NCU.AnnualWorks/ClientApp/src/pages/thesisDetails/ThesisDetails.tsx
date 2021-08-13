import { ComboBox, CommandBar, DefaultButton, DetailsRow, Dialog, DialogFooter, FontSizes, IColumn, ICommandBarItemProps, IconButton, IDropdownOption, IStackTokens, Label, Link, mergeStyles, MessageBar, MessageBarType, PrimaryButton, SelectionMode, Stack, StackItem } from '@fluentui/react';
import React, { useContext, useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import Loader from '../../components/loader/Loader';
import { addActions, editGradeAction } from '../../components/thesisActions/ThesisActions';
import Tile from '../../components/Tile';
import { RouteNames } from '../../shared/consts/RouteNames';
import { useThesis } from '../../shared/hooks/ThesisHooks';
import { AuthenticationContext } from '../../shared/providers/AuthenticationProvider';
import ReviewModal from '../../components/reviewModal/ReviewModal';
import { useApi } from '../../shared/api/Api';
import ThesisGradeConfirmDialog from '../../components/thesisGradeConfirm/ThesisGradeConfirmDialog';
import { useBoolean } from '@fluentui/react-hooks';

interface ThesisDetailsProps {
  guid: string
}

export const ThesisDetails: React.FC<ThesisDetailsProps> = (props) => {
  const authContext = useContext(AuthenticationContext);
  const history = useHistory();

  const [thesis, isFetching] = useThesis(props.guid);
  const [isPromoterReviewVisible, setIsPromoterReviewVisible] = useState<boolean>(false);
  const [isReviewerReviewVisible, setIsReviewerReviewVisible] = useState<boolean>(false);
  const [confirmDialog, { toggle: toggleConfirmDialog }] = useBoolean(true);

  if(isFetching || !thesis) {
    return <Loader size='medium' label={"Ładowanie..."} />
  } 
  // else {
  //   if(!thesis) {
  //     return <Redirect to={RouteNames.error} />
  //   }
  // }
  
  //Adding available actions
  const actionItems: ICommandBarItemProps[] = addActions(thesis, history, false);
  if(thesis?.actions.canEditGrade) {
    actionItems.push(editGradeAction({
      iconOnly: false,
      onClick: () => toggleConfirmDialog()
    }))
  }

  const columns: IColumn[] = [
    //{ key: 'action', name: 'Akcja', fieldName: 'action', minWidth: 50, maxWidth: 50 },
    { key: 'name', name: 'Imie i nazwisko', fieldName: 'name', minWidth: 200, maxWidth: 500 },
    { key: 'grade', name: 'Ocena', fieldName: 'grade', minWidth: 200, maxWidth: 500 },
  ];

  const iconStyles = mergeStyles({
    fontWeight: '600!important'
  }); 

  const reviewAddAction = (
    <IconButton 
      iconProps={{ iconName: 'PageAdd', className: `${iconStyles}` }} 
      //href={RouteNames.addReviewPath(props.guid)} 
      onClick={() => history.push(RouteNames.addReviewPath(props.guid))} />
  );

  const reviewEditAction = (reviewGuid: string) => (
    <IconButton 
      iconProps={{ iconName: 'PageEdit', className: `${iconStyles}` }} 
      //href={RouteNames.editReviewPath(props.guid, reviewGuid)} 
      onClick={() => history.push(RouteNames.editReviewPath(props.guid, reviewGuid))} />
  );

  const getPromoterAction = () => {
    if(thesis?.promoter.usosId === authContext.currentUser?.id) {
      if(thesis?.promoterReview && thesis.actions.canEditReview) {
        return reviewEditAction(thesis.promoterReview.guid!);
      } else if(thesis.actions.canAddReview) {
        return reviewAddAction;
      } else {
        return null;
      }
    }
  }

  const getReviewerAction = () => {
    if(thesis?.reviewer.usosId === authContext.currentUser?.id) {
      if(thesis?.reviewerReview && thesis.actions.canEditReview) {
        return reviewEditAction(thesis.reviewerReview.guid!);
      } else if(thesis.actions.canAddReview) {
        return reviewAddAction;
      } else {
        return null;
      }
    }
  }

  const promoterReview = {
    name: `${thesis?.promoter.firstName} ${thesis?.promoter.lastName}`,
    grade: thesis?.promoterReview?.grade ?? "Brak oceny",
    action: getPromoterAction(),
    showModal: thesis.promoterReview ? () => setIsPromoterReviewVisible(true) : undefined
  };

  const reviewerReview = {
    name: `${thesis?.reviewer.firstName} ${thesis?.reviewer.lastName}`,
    grade: thesis?.reviewerReview?.grade ?? "Brak oceny",
    action: getReviewerAction(),
    showModal: thesis.reviewerReview ? () => setIsReviewerReviewVisible(true) : undefined
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
        if(item.showModal) {
          return <Link style={{fontSize: FontSizes.size14}} onClick={item.showModal}>{item.name}</Link>
        } else {
          return <Label>{item.name}</Label>
        }
      case 'grade':
        return <Label>Ocena: {item.grade}</Label>
      default:
        return null;
    }
  }

  const stackTokens: IStackTokens = { childrenGap: 10 };
  const containerStackTokens: IStackTokens = { childrenGap: 15 };

  const containerStyles = mergeStyles({
    width: '100%'
  });

  const rowStyles = mergeStyles({
    alignItems: 'center'
  });

  const reviewModal = (name: string, isVisible: boolean, setIsVisible: (value: boolean) => void, guid?: string) => {
    if(!guid) {
      return null;
    }
    return (
      <ReviewModal 
        guid={guid}
        person={name}
        isModalVisible={isVisible}
        setModalVisible={setIsVisible}
      />
    )
  };

  const gradeConflictMessageBar = (
    <Stack tokens={stackTokens}>
      <MessageBar messageBarType={MessageBarType.blocked} isMultiline>
        Oceny wystawione w recenzjach nie pozwalają na wyliczenie średniej, która może zostać wpisana do systemu USOS.
        Skontaktuj się z promotorem lub recenzentem i wspólnie ustalcie końcową ocenę pracy. 
        Ostatecznie ocena musi zostać zatwierdzona w systemie przez promotora przy wykorzystaniu akcji 'wystaw ocenę'.
      </MessageBar>
    </Stack>
  );

  return (
    <Stack className={containerStyles} tokens={containerStackTokens}>
      <Tile title={thesis?.title}>
        {thesis?.promoterReview?.grade && thesis?.reviewerReview?.grade && !thesis.grade ? gradeConflictMessageBar : null}
        <ThesisGradeConfirmDialog guid={thesis.guid} isVisible={confirmDialog} setIsVisible={toggleConfirmDialog} />
        {/* Due to a bug, command bar cannot be put inside a flexbox https://github.com/microsoft/fluentui/issues/16268 */}
        <Stack>
          <CommandBar
            className='theses-simple-list-actions'
            items={actionItems}
          />
        </Stack>
        <Stack tokens={stackTokens}>
          <Label>Dodana: {new Date(thesis?.createdAt!).toLocaleDateString()}</Label>
          <Label>
            {thesis?.thesisAuthors.length === 1 ? "Autor" : "Autorzy"}: {thesis?.thesisAuthors.map(p => `${p.firstName} ${p.lastName}`).join(', ')}
          </Label>
        </Stack>
        <Stack tokens={stackTokens}>
          <Label style={{fontSize: FontSizes.size20}}>Abstrakt:</Label>
          <p>{thesis?.abstract}</p>
          <Label style={{fontSize: FontSizes.size20}}>Słowa kluczowe:</Label>
          <p>{thesis?.thesisKeywords.map(k => k.text).join(', ')}</p>
          <Label style={{fontSize: FontSizes.size20}}>Recenzja promotora:</Label>
          <DetailsRow 
            className={rowStyles}
            selectionMode={SelectionMode.none}
            itemIndex={0}
            item={promoterReview} 
            columns={columns}
            onRenderItemColumn={onRenderItemColumn}
          />
          {reviewModal(promoterReview.name, isPromoterReviewVisible, setIsPromoterReviewVisible, thesis.promoterReview?.guid)}
          <Label style={{fontSize: FontSizes.size20}}>Recenzja recenzenta:</Label>
          <DetailsRow 
            className={rowStyles}
            selectionMode={SelectionMode.none}
            itemIndex={0}
            item={reviewerReview} 
            columns={columns}
            onRenderItemColumn={onRenderItemColumn}
          />
          {reviewModal(reviewerReview.name, isReviewerReviewVisible, setIsReviewerReviewVisible, thesis.reviewerReview?.guid)}
          <Label style={{fontSize: FontSizes.size20}}>Ocena końcowa: {thesis.grade ?? "Brak oceny"}</Label>
        </Stack>
      </Tile>
      <Stack horizontal tokens={stackTokens}>
        <StackItem>
          <PrimaryButton 
            //href={RouteNames.root} 
            onClick={() => history.push(RouteNames.root)}
            >
              Powrót do listy prac
            </PrimaryButton>
        </StackItem>
      </Stack>
    </Stack>
  );
}

export default ThesisDetails;