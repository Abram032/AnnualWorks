import React from 'react';
import { CommandBar, DetailsList, FontSizes, IColumn, IGroup, Label, SelectionMode } from '@fluentui/react';
import { addActions } from './ThesisActions';
import { RouteNames } from '../../shared/Consts';
import { Thesis } from '../../shared/Models';
import { Link } from '../../Components';

interface ThesisListProps {
  title: string,
  items: Thesis[],
  isCollapsed?: boolean,
  renderHeader?: boolean,
}

export const ThesisList: React.FC<ThesisListProps> = (props) => {
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
        if (item.actions.canView) {
          return <Link style={{ fontSize: FontSizes.size16 }} href={RouteNames.detailsPath(item.guid)}>{item.title} {item.hidden ? "(Ukryta)" : null}</Link>
        } else {
          return <Label>{item.title}</Label>
        }
      case 'actions':
        const actionItems = addActions(item, true);
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