import React from 'react';
import { DetailsList, IColumn, Icon, IGroup, mergeStyles, SelectionMode } from '@fluentui/react';
import { ModificationType, ModificationTypeDescription, ModificationTypeIcons, ThesisLog } from '../../shared/Models';

interface ThesisHistoryLogProps {
  thesisLogs: ThesisLog[] 
}

export const ThesisHistoryLog: React.FC<ThesisHistoryLogProps> = (props) => {
  const sortedThesisLogs = props.thesisLogs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const groups: IGroup[] = [{
    key: "thesisLogs",
    name: "Historia zmian",
    startIndex: 0,
    count: props.thesisLogs.length,
    isCollapsed: true,
  }];

  const columns: IColumn[] = [
    { key: 'modificationType', name: 'Rodzaj zmiany', fieldName: 'modificationType', minWidth: 25, maxWidth: 25 },
    { key: 'timestamp', name: 'Data', fieldName: 'timestamp', minWidth: 150, maxWidth: 150 },
    { key: 'description', name: 'Opis', fieldName: 'description', minWidth: 150, maxWidth: 250 },
  ];

  const onRenderItemColumn = (
    item: ThesisLog,
    index?: number,
    column?: IColumn
  ): React.ReactNode => {
    switch (column?.key) {
      case 'modificationType':
        return <Icon iconName={ModificationTypeIcons[item.modificationType]} className={iconClass} />;
      case 'timestamp':
        return `${new Date(item.timestamp).toLocaleDateString()} ${new Date(item.timestamp).toLocaleTimeString()}`
      case 'description':
        return ModificationTypeDescription[item.modificationType](item.user);
      default:
        return null;
    }
  };

  return (
    <DetailsList
      className='theses-simple-list'
      items={sortedThesisLogs}
      columns={columns}
      groups={groups}
      selectionMode={SelectionMode.none}
      onRenderItemColumn={onRenderItemColumn}
      onRenderDetailsHeader={() => null}
      compact
      groupProps={{
        showEmptyGroups: true
      }}
    />
  )
}

//#region Styles

const iconClass = mergeStyles({
  fontSize: 16,
  height: 16,
  width: 16,
});

//#endregion