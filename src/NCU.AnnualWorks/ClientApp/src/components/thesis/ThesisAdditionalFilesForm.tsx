import { ActionButton, CommandBar, DetailsList, FontSizes, IColumn, ICommandBarItemProps, mergeStyles, MessageBar, MessageBarType, SelectionMode, Stack } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router';
import { Tile, Loader } from '../../Components';
import { File } from '../../shared/Models';
import { RouteNames } from '../../shared/Consts';
import { useThesisFiles } from '../../shared/Hooks';
import { fileSizeToHR } from '../../shared/Utils';
import { AppSettings } from '../../AppSettings';
import { useBoolean } from '@fluentui/react-hooks';
import { ThesisFileUploadDialog } from './ThesisFileUploadDialog';
import { Api } from '../../shared/api/Api';

interface ThesisAddtionalFilesFormProps {
  thesisGuid: string,
  addFileVisible?: boolean,
}

export const ThesisAddtionalFilesForm: React.FC<ThesisAddtionalFilesFormProps> = (props) => {
  const history = useHistory();
  const [files, isFilesFetching] = useThesisFiles(props.thesisGuid);
  const [uploadDialogIsVisible, { toggle: toggleUploadDialogIsVisible }] = useBoolean(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  if(isFilesFetching) {
    return (
      <Tile title="Pliki pracy">
        <Loader />
      </Tile>
    )
  }

  if(!files) {
    return <Redirect to={RouteNames.error} />
  }

  //const iconColumn = (item: File) => (<Icon className={iconStlyes} iconName={item.extension.replace('.', '')} />);
  const nameColumn = (item: File) => (item.fileName);
  const sizeColumn = (item: File) => (fileSizeToHR(item.size));
  const actionsColumn = (item: File) => {
    const actions: ICommandBarItemProps[] = [];
    if(item.actions?.canDownload) {
      actions.push({
        key: 'download',
        text: 'Pobierz plik',
        iconProps: {
          iconName: 'Download',
          className: `${actionStyles}`
        },
        ariaLabel: 'Download',
        iconOnly: true,
        href: `${AppSettings.API.Files.Base}/${item.guid}`,
        target: '_blank',
      });
    }
    if(item.actions?.canDelete) {
      actions.push({
        key: 'delete',
        text: 'Usuń plik',
        iconProps: {
          iconName: 'Delete',
          className: `${actionStyles}`
        },
        ariaLabel: 'Delete',
        iconOnly: true,
        onClick: () => {
          setErrorMessage(undefined);
          Api.delete(`${AppSettings.API.Files.Base}/${item.guid}`)
            .then(result => history.push(RouteNames.detailsPath(props.thesisGuid)))
            .catch(error => setErrorMessage(error.data ?? error.message));
        }
      });
    }
    return (
      <CommandBar 
        items={actions}
      />
    )
  };
  const columns: IColumn[] = [
    //{ key: 'icon', name: 'Typ pliku', iconName: 'Page', isIconOnly: true, fieldName: 'icon', minWidth: 25, maxWidth: 25, className: iconStlyes, onRender: iconColumn },
    { key: 'name', name: 'Nazwa pliku', fieldName: 'filename', minWidth: 150, maxWidth: 150, onRender: nameColumn },
    { key: 'size', name: 'Rozmiar', fieldName: 'size', minWidth: 75, maxWidth: 75, onRender: sizeColumn },
    { key: 'actions', name: 'Akcje', fieldName: 'actions', minWidth: 75, maxWidth: 75, onRender: actionsColumn }
  ];

  const addFileAction = props.addFileVisible ? 
    (
      <ActionButton iconProps={{ iconName: 'Upload', className: actionStyles }} onClick={toggleUploadDialogIsVisible}>
        Dodaj pliki
      </ActionButton>
    ) : null;

  const errorMessageBar = (
    <MessageBar messageBarType={MessageBarType.error}>
      {errorMessage}
    </MessageBar>
  );

  return (
    <Tile title="Pliki pracy">
      <ThesisFileUploadDialog 
        guid={props.thesisGuid} 
        isVisible={uploadDialogIsVisible} 
        toggleIsVisible={toggleUploadDialogIsVisible} 
        options={{
          maxFileCount: 10,
          maxSize: 10000000,
          allowedExtensions: [".sav"]
        }}
      />
      {!errorMessageBar ? errorMessageBar : null}
      <Stack horizontalAlign='end'>
        {addFileAction}
      </Stack>
      <DetailsList 
        className='file-list'
        items={files}
        columns={columns}
        selectionMode={SelectionMode.none}
        isHeaderVisible={true}
      />
    </Tile>
  );
}

//#region Styles

const iconStlyes = mergeStyles({
  fontSize: FontSizes.size18
});

const actionStyles = mergeStyles({
  fontWeight: '600!important'
});

//#endregion Styles