import React from 'react';
import { DetailsList, IColumn, Icon, IGroup, mergeStyles, Persona, PersonaSize, SelectionMode, Stack } from '@fluentui/react';
import { ModificationTypeDescription, ModificationTypeIcons, ThesisLog } from '../../shared/Models';

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
        return (
          <Stack verticalAlign="center" horizontalAlign="center" horizontal>
            <Icon iconName={ModificationTypeIcons[item.modificationType]} className={iconClass} />
          </Stack>
        )
      case 'timestamp':
        return (
          <Stack verticalAlign="center" horizontalAlign="center" horizontal>
            {`${new Date(item.timestamp).toLocaleDateString()} ${new Date(item.timestamp).toLocaleTimeString()}`}
          </Stack>
        );
      case 'description':
        return (
          <Stack verticalAlign="center" horizontal>
            <Persona 
              imageUrl={item.user.photoUrl} 
              imageAlt={`${item.user.firstName} ${item.user.lastName}`} 
              imageInitials={`${item.user.firstName.substring(0, 1)}${item.user.lastName.substring(0, 1)}`} 
              size={PersonaSize.size24}
            />
            {ModificationTypeDescription[item.modificationType](item.user)}
          </Stack>
        );
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