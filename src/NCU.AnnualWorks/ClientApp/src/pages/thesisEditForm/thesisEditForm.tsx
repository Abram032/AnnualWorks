import React, { useContext } from 'react';
import { FilePickerOptions } from '../../components/filePicker/filePickerOptions';
import { ThesisForm } from '../../components/thesisForm/thesisForm';
import { useThesis } from '../../shared/hooks/ThesisHooks';
import { useKeywords } from '../../shared/hooks/KeywordHooks';
import { useEmployees, useStudents } from '../../shared/hooks/UserHooks';
import { AuthenticationContext } from '../../shared/providers/AuthenticationProvider';
import Api from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';
import { Loader } from '../../components/loader/loader';

interface ThesisEditFormProps {
  guid: string
};

export const ThesisEditForm: React.FC<ThesisEditFormProps> = (props) => {
  const authContext = useContext(AuthenticationContext);

  const [thesis, isFetching] = useThesis(props.guid);
  const keywords = useKeywords();
  const students = useStudents();
  const employees = useEmployees();

  const filePickerOptions: FilePickerOptions = {
    allowedExtensions: [".pdf"],
    maxFileCount: 1,
    maxSize: 10000000
  };
  
  const onSave = (formData: FormData) => 
    Api.put(`${AppSettings.API.Theses.Base}/${props.guid}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

  if(isFetching && !thesis) {
    return <Loader label='Ładowanie...' size='medium' />
  }

  return (
    <ThesisForm 
      thesis={thesis}
      keywords={keywords}
      students={students}
      employees={employees}
      excludedUserIds={authContext.currentUser ? [authContext.currentUser.id] : undefined}
      onSave={onSave}
      fileOptions={filePickerOptions}
    />
  )
};

export default ThesisEditForm;