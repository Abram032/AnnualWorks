import React from 'react';
import { filePickerDefaultOptions } from '../../shared/Models';
import { ThesisForm } from '../../components/thesis/ThesisForm';
import { useKeywords, useEmployees, useStudents, useCurrentUser } from '../../shared/Hooks';
import { Api } from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';
import { Loader } from '../../Components';
import { Redirect } from 'react-router-dom';
import { RouteNames } from '../../shared/Consts';

export const ThesisCreateForm: React.FC = () => {
  const currentUser = useCurrentUser();
  const [keywords, keywordsFetching] = useKeywords();
  const [students, studentsFetching] = useStudents();
  const [employees, employeesFetching] = useEmployees();

  if(keywordsFetching || studentsFetching || employeesFetching) {
    return <Loader />
  }

  if(!currentUser?.isLecturer) {
    return <Redirect to={RouteNames.forbidden} />
  }

  if(!keywords || !students || !employees || !currentUser) {
    return <Redirect to={RouteNames.error} />
  }
  

  const onSave = (formData: FormData) => 
    Api.post(AppSettings.API.Theses.Base, formData, {
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