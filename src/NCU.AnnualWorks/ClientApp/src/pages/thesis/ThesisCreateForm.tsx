import React from 'react';
import { filePickerDefaultOptions } from '../../shared/Models';
import { ThesisForm } from '../../components/thesis/ThesisForm';
import { useKeywords, useEmployees, useStudents, useCurrentUser } from '../../shared/Hooks';
import { useApi } from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';
import { Loader } from '../../Components';
import { Redirect } from 'react-router-dom';
import { RouteNames } from '../../shared/Consts';

export const ThesisCreateForm: React.FC = () => {
  const api = useApi();
  const currentUser = useCurrentUser();
  const [keywords, keywordsFetching] = useKeywords();
  const [students, studentsFetching] = useStudents();
  const [employees, employeesFetching] = useEmployees();

  if(keywordsFetching || studentsFetching || employeesFetching) {
    return <Loader />
  }

  if(!keywords || !students || !employees || !currentUser) {
    return <Redirect to={RouteNames.error} />
  }

  if(!currentUser.isLecturer) {
    return <Redirect to={RouteNames.forbidden} />
  }

  const onSave = (formData: FormData) => 
    api.post(AppSettings.API.Theses.Base, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

  return (
    <ThesisForm 
      keywords={keywords}
      students={students}
      employees={employees}
      excludedUserIds={[currentUser.id]}
      onSave={onSave}
      fileOptions={filePickerDefaultOptions}
    />
  )
};

export default ThesisCreateForm;