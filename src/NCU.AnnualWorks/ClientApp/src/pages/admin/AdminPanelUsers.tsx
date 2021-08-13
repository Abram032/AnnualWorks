import React, { useState } from "react";
import AdminPanel from './AdminPanel';
import { RouteNames } from "../../shared/consts/RouteNames";
import { mapUsersToPersona } from "../../shared/utils/Mappers";
import { IPersonaProps, IStackTokens, MessageBar, MessageBarType, PrimaryButton, StackItem } from "@fluentui/react";
import { useForm } from "react-hook-form";
import ControlledPeoplePicker from '../../components/peoplePicker/ControlledPeoplePicker';
import { useCustomUsers, usePeoplePicker } from '../../shared/Hooks';
import { SetCustomUsersRequestData, useApi } from "../../shared/api/Api";
import { AppSettings } from "../../AppSettings";
import User from "../../shared/models/User";
import Loader from "../../components/Loader";

export const AdminPanelUsers: React.FC = () => {
  const customUsers = useCustomUsers();

  if(customUsers) {
    return <AdminPanelUsersForm 
      users={customUsers}
    />
  }
  else {
    return <Loader size='medium' label='Ładowanie...' />
  }
}

export default AdminPanelUsers;

interface Form {
  users: IPersonaProps[]
}

interface AdminPanelUsersFormProps {
  users: User[]
}

const AdminPanelUsersForm: React.FC<AdminPanelUsersFormProps> = (props) => {
  const api = useApi();
  const [users, selectedUsers, onChangeSelectedUsers] = usePeoplePicker(props.users);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [success, setIsSuccess] = useState<boolean>();

  const { handleSubmit, control } = useForm<Form, any>({
    defaultValues: {
      users: mapUsersToPersona(props.users)
    },
    reValidateMode: "onSubmit",
    mode: "all"
  });

  const maxSuggestions = 10;
  const onFilterChanged = (
    filter: string,
    selectedItems?: IPersonaProps[]
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
    return api.get<User[]>(`${AppSettings.API.Users.Base}?search=${filter.trim()}`)
      .then(res => mapUsersToPersona(res.data))
      .then(people => people.filter(p => (
          p.text?.toLowerCase().startsWith(filter.toLowerCase()) || 
          p.secondaryText?.toLowerCase().startsWith(filter.toLowerCase())
        ) && !selectedItems?.some(u => u.key === p.key))
        .sort((p1, p2) => p1.text!.localeCompare(p2.text!))
        .slice(0, maxSuggestions))
      .catch(err => {
        setErrorMessage(err.data);
        const empty: IPersonaProps[] = [];
        return empty;
      });
  };

  const onSave = () => {
    setIsSuccess(false);
    setErrorMessage(undefined);
    
    handleSubmit(
      (values) => {
        const request: SetCustomUsersRequestData = {
          userIds: values.users.map<string>(u => u.key!.toString())
        }
        api.put(AppSettings.API.Users.Custom, request)
        .then(res => {
          setIsSuccess(true);
        })
        .catch(err => {
          setIsSuccess(false);
          setErrorMessage(err.data);
        })
      },
      (err) => {
      }
    )();
  };

  const errorMessageBar = (
    <MessageBar messageBarType={MessageBarType.error}>
      {errorMessage}
    </MessageBar>
  )

  const successMessageBar = (
    <MessageBar messageBarType={MessageBarType.success}>
      Zapisano.
    </MessageBar>
  );

  const tokens: IStackTokens = { childrenGap: 15 };

  return (
    <AdminPanel>
      {errorMessage ? errorMessageBar : null}
      {success ? successMessageBar : null}
      <StackItem tokens={tokens}>
        <ControlledPeoplePicker
          required={true}
          label="Użytkownicy niestandardowi"
          name="users"
          control={control}
          people={users}
          selectedPeople={selectedUsers}
          onChange={onChangeSelectedUsers}
          maxSuggestions={maxSuggestions}
          resolveDelay={500}
          onFilterChanged={onFilterChanged}
          defaultValue={mapUsersToPersona(props.users)}
        />
      </StackItem>
      <StackItem tokens={tokens}>
        <PrimaryButton text="Zatwierdź" onClick={onSave} />
      </StackItem>
    </AdminPanel>
  );
};