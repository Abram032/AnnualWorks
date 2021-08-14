import React, { useContext } from 'react';
import { FilePickerOptions } from '../../shared/Models';
import { ThesisForm } from '../../components/thesis/ThesisForm';
import { useKeywords, useEmployees, useStudents } from '../../shared/Hooks';
import { AuthenticationContext } from '../../shared/providers/AuthenticationProvider';
import { useApi } from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';
import { Loader } from '../../Components';

export const ThesisCreateForm: React.FC = () => {
  const authContext = useContext(AuthenticationContext);
  const api = useApi();
  
  const keywords = useKeywords();
  const students = useStudents();
  const employees = useEmployees();

  const filePickerOptions: FilePickerOptions = {
    allowedExtensions: [".pdf"],
    maxFileCount: 1,
    maxSize: 10000000
  };

  const onSave = (formData: FormData) => 
    api.post(AppSettings.API.Theses.Base, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

  if(!students || !employees) {
    return <Loader />
  }

  return (
    <ThesisForm 
      keywords={keywords}
      students={students}
      employees={employees}
      excludedUserIds={authContext.currentUser ? [authContext.currentUser.id] : undefined}
      onSave={onSave}
      fileOptions={filePickerOptions}
    />
  )
};

export default ThesisCreateForm;