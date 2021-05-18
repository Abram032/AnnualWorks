import React from 'react';
import { CommandBar, DetailsList, FontSizes, IColumn, IGroup, Link, SelectionMode } from '@fluentui/react';
import { downloadAction, editAction, printAction, addReviewAction, editReviewAction } from '../thesisActions/thesisActions';
import { RouteNames } from '../../shared/consts/RouteNames';
import Thesis from '../../shared/models/Thesis';
import { useHistory } from 'react-router-dom';

interface ThesisListProps {
  title: string,
  items: Thesis[],
  isCollapsed?: boolean,
  renderHeader?: boolean,
}

export const ThesisList: React.FC<ThesisListProps> = (props) => {
  const history = useHistory();
  const groups: IGroup[] = [{
    key: props.title,
    name: props.title,
    startIndex: 0,
    count: props.items.length,
    isCollapsed: props.isCollapsed ?? true,
  }];

  const columns: IColumn[] = [
    { key: 'title', name: 'Tytuł', fieldName: 'title', minWidth: 200, maxWidth: 1000 },
    { key: 'actions', name: 'Akcje', fieldName: 'actions', minWidth: 200, maxWidth: 200 },
  ];

  const onRenderItemColumn = (
    item: Thesis,
    index?: number,
    column?: IColumn
  ): React.ReactNode => {
    switch (column?.key) {
      case 'title':
        return <Link 
          style={{fontSize: FontSizes.size16}} 
          href={RouteNames.detailsPath(item.guid)} 
          onClick={() => history.push(RouteNames.detailsPath(item.guid))}>
            {item.title}
          </Link>;
      case 'actions':
        const actionItems = [];
        if(item.actions.canAddReview) actionItems.push(addReviewAction({href: RouteNames.review}));
        if(item.actions.canEditReview) actionItems.push(editReviewAction({href: RouteNames.review}));
        if(item.actions.canEdit) actionItems.push(editAction({href: RouteNames.editThesisPath(item.guid)}));
        if(item.actions.canDownload) actionItems.push(downloadAction({disabled: true}));
        if(item.actions.canPrint) actionItems.push(printAction({disabled: true}));
        return (
          <CommandBar
            className='theses-simple-list-actions'
            items={actionItems}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DetailsList 
      className='theses-simple-list'
      items={props.items}
      columns={columns}
      groups={groups}
      selectionMode={SelectionMode.none}
      onRenderItemColumn={onRenderItemColumn}
      onRenderDetailsHeader={() => null}
      groupProps={{
        showEmptyGroups: true
      }}
    />
  );
}

export default ThesisList;