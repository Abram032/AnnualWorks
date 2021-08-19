import React from 'react';
import { filePickerDefaultOptions } from '../../shared/Models';
import { ThesisForm, Loader } from '../../Components';
import { useThesis, useKeywords,useEmployees, useStudents, useCurrentUser } from '../../shared/Hooks';
import { Api } from '../../shared/api/Api';
import { AppSettings } from '../../AppSettings';
import { Redirect } from 'react-router-dom';
import { RouteNames } from '../../shared/Consts';

interface ThesisEditFormProps {
  guid: string
};

export const ThesisEditForm: React.FC<ThesisEditFormProps> = (props) => {
  const currentUser = useCurrentUser();
  const [thesis, thesisFetching] = useThesis(props.guid);
  const [keywords, keywordsFetching] = useKeywords();
  const [students, studentsFetching] = useStudents();
  const [employees, employeesFetching] = useEmployees();

  if(keywordsFetching || studentsFetching || employeesFetching || thesisFetching) {
    return <Loader />
  }

  if(!thesis || !keywords || !students || !employees || !currentUser) {
    return <Redirect to={RouteNames.error} />
  }

  if(!currentUser.isLecturer) {
    return <Redirect to={RouteNames.forbidden} />
  }
  
  const onSave = (formData: FormData) => 
    Api.put(`${AppSettings.API.Theses.Base}/${props.guid}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

  return (
    <ThesisForm 
      thesis={thesis}
      keywords={keywords}
      students={students}
      employees={employees}
      excludedUserIds={[currentUser.id]}
      onSave={onSave}
      fileOptions={filePickerDefaultOptions}
    />
  )
};

export default ThesisEditForm;