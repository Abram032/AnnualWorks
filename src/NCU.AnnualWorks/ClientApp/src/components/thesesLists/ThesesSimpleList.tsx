import React from 'react';
import { CommandBar, DetailsList, FontSizes, IColumn, ICommandBarItemProps, IGroup, Link, SelectionMode } from '@fluentui/react';
import { downloadAction, editAction, printAction, addReviewAction, editReviewAction } from '../thesisActions/ThesisActions';

interface ThesesSimpleListProps {
  title: string,
  items: any[],
  isCollapsed?: boolean,
  renderHeader?: boolean,
}

export const ThesesSimpleList: React.FC<ThesesSimpleListProps> = (props) => {
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
    item: any,
    index?: number,
    column?: IColumn
  ): React.ReactNode => {
    switch (column?.key) {
      case 'title':
        return <Link style={{fontSize: FontSizes.size16}} href="/thesis">{item.title}</Link>;
      case 'actions':
        const actionItems = [];
        if(item.canAddReview) actionItems.push(addReviewAction({}));
        if(item.canEditReview) actionItems.push(editReviewAction({}));
        if(item.canEdit) actionItems.push(editAction({}));
        if(item.canDownload) actionItems.push(downloadAction({}));
        if(item.canPrint) actionItems.push(printAction({}));
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
    />
  );
}

export default ThesesSimpleList;