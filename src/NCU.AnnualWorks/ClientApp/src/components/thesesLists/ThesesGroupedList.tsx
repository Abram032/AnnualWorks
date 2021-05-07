import React from 'react';
import { CommandBar, DetailsList, DetailsRow, FontSizes, GroupedList, IColumn, ICommandBarItemProps, IGroup, Link, SelectionMode } from '@fluentui/react';
import { downloadAction, editAction, printAction, addReviewAction, editReviewAction } from '../thesisActions/ThesisActions';
import ThesesSimpleList from './ThesesSimpleList';

interface ThesesGroupedListProps {
  title: string,
  items: any[],
  isCollapsed?: boolean,
  renderHeader?: boolean,
}

export const ThesesGroupedList: React.FC<ThesesGroupedListProps> = (props) => {

  // const createGroups = (): IGroup[] => {
  //   const rootGroup: IGroup[] = [{
  //     key: props.title,
  //     name: props.title,
  //     isCollapsed: true,
  //     startIndex: 0,
  //     count: 0,
  //   }];
  //   props.items.forEach(element => 
  //     rootGroup[0].children.push({
  //       key: element.key,
  //       name: element.term,
  //       startIndex: 0,
  //       count: element.items.length,
  //       isCollapsed: true
  //     })
  //   );
  //   return rootGroup;
  // }

  // const columns: IColumn[] = [
  //   { key: 'title', name: 'Tytuł', fieldName: 'title', minWidth: 200, maxWidth: 1000 },
  //   { key: 'actions', name: 'Akcje', fieldName: 'actions', minWidth: 200, maxWidth: 200 },
  // ];

  // const onRenderItemColumn = (
  //   item: any,
  //   index?: number,
  //   column?: IColumn
  // ): React.ReactNode => {
  //   switch (column?.key) {
  //     case 'title':
  //       return <Link style={{fontSize: FontSizes.size16}} href="#">{item.title}</Link>;
  //     case 'actions':
  //       const actionItems = [];
  //       actionItems.push(addReviewAction({}));
  //       actionItems.push(editReviewAction({}));
  //       actionItems.push(editAction({}));
  //       actionItems.push(downloadAction({}));
  //       actionItems.push(printAction({}));
  //       return (
  //         <CommandBar
  //           className='theses-simple-list-actions'
  //           items={actionItems}
  //         />
  //       );
  //     default:
  //       return null;
  //   }
  // };

  const onRenderCell = (
    nestingDepth?: number,
    item?: any,
    itemIndex?: number,
    group?: IGroup,
  ): React.ReactNode => {
    return item && typeof itemIndex === 'number' && itemIndex > -1 ? (
      // <DetailsRow
      //   columns={columns}
      //   groupNestingDepth={nestingDepth}
      //   item={item}
      //   itemIndex={itemIndex}
      //   selectionMode={SelectionMode.none}
      //   group={group}
      //   onRenderItemColumn={onRenderItemColumn}
      // />
      <ThesesSimpleList title={item.term} items={item.items} />
    ) : null;
  }

  return (
    <GroupedList 
      className='theses-simple-list'
      items={props.items}
      //columns={columns}
      //groups={createGroups()}
      selectionMode={SelectionMode.none}
      //onRenderItemColumn={onRenderItemColumn}
      onRenderCell={onRenderCell}
    />
  );
}

export default ThesesGroupedList;