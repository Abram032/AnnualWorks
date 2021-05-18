import { CommandBar, DefaultButton, DetailsRow, FontSizes, IColumn, ICommandBarItemProps, IconButton, IStackTokens, Label, mergeStyles, PrimaryButton, SelectionMode, Stack, StackItem } from '@fluentui/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import Loader from '../../components/loader/loader';
import { addReviewAction, downloadAction, editAction, printAction, viewAction, editReviewAction } from '../../components/thesisActions/thesisActions';
import Tile from '../../components/tile/tile';
import { RouteNames } from '../../shared/consts/RouteNames';
import { useThesis } from '../../shared/hooks/ThesisHooks';

interface ThesisDetailsProps {
  guid: string
}

export const ThesisDetails: React.FC<ThesisDetailsProps> = (props) => {
  const history = useHistory();
  const [thesis, isFetching] = useThesis(props.guid);

  if(isFetching) {
    return <Loader size='medium' label={"Ładowanie..."} />
  }

  if(!isFetching && !thesis) {
    //TODO: Error page
    return (<> </>)
  }
  
  //Adding available actions
  const actionItems: ICommandBarItemProps[] = [];
  if(thesis?.actions.canView) 
    actionItems.push(viewAction({iconOnly: false, disabled: true}));
  if(thesis?.actions.canDownload) 
    actionItems.push(downloadAction({iconOnly: false, disabled: true}));
  if(thesis?.actions.canEdit) 
    actionItems.push(editAction({
      iconOnly: false, 
      href: RouteNames.editThesisPath(thesis?.guid), 
      onClick: () => history.push(RouteNames.editThesisPath(thesis?.guid))
    }));
  if(thesis?.actions.canPrint) 
    actionItems.push(printAction({iconOnly: false, disabled: true}));
  if(thesis?.actions.canAddReview) 
    actionItems.push(addReviewAction({iconOnly: false, href: RouteNames.review, onClick: () => history.push(RouteNames.review)}));
  if(thesis?.actions.canEditReview) 
    actionItems.push(editReviewAction({iconOnly: false, href: RouteNames.review, onClick: () => history.push(RouteNames.review)}));

  const columns: IColumn[] = [
    { key: 'action', name: 'Akcja', fieldName: 'action', minWidth: 50, maxWidth: 50 },
    { key: 'name', name: 'Imie i nazwisko', fieldName: 'name', minWidth: 200, maxWidth: 500 },
    { key: 'grade', name: 'Ocena', fieldName: 'grade', minWidth: 200, maxWidth: 500 },
  ];

  const reviewP = {
    name: 'Jan Nowak',
    grade: 4
  };

  const reviewR = {
    name: 'Jan Kowalski',
    grade: 5
  };

  const iconStyles = mergeStyles({
    fontWeight: '600!important'
  });  

  const onRenderItemColumn = (
    item: any,
    itemIndex?: number,
    column?: IColumn
  ): React.ReactNode => {
    switch (column?.key) {
      case 'action':
        return <IconButton 
          iconProps={{ iconName: 'PageAdd', className: `${iconStyles}` }} 
          href={RouteNames.review} 
          onClick={() => history.push(RouteNames.review)} 
        />
      case 'name':
        return <Label>{item.name}</Label>
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

  return (
    <Stack className={containerStyles} tokens={containerStackTokens}>
      <Tile title={thesis?.title}>
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
            selectionMode={SelectionMode.none}
            itemIndex={0}
            item={reviewP} 
            columns={columns}
            onRenderItemColumn={onRenderItemColumn}
          />
          <Label style={{fontSize: FontSizes.size20}}>Recenzja recenzenta:</Label>
          <DetailsRow 
            selectionMode={SelectionMode.none}
            itemIndex={0}
            item={reviewR} 
            columns={columns}
            onRenderItemColumn={onRenderItemColumn}
          />
        </Stack>
      </Tile>
      <Stack horizontal tokens={stackTokens}>
        <StackItem>
          <PrimaryButton href={RouteNames.root} onClick={() => history.push(RouteNames.root)}>Powrót do listy prac</PrimaryButton>
        </StackItem>
      </Stack>
    </Stack>
  );
}

export default ThesisDetails;