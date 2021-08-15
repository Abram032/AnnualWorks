import React, { useState } from "react";
import { mapUsersToPersona } from "../../shared/Utils";
import { IPersonaProps, IStackTokens, MessageBar, MessageBarType, PrimaryButton, StackItem } from "@fluentui/react";
import { useForm } from "react-hook-form";
import { PeoplePicker, AdminPanel, Loader, filterPeople } from '../../Components';
import { useCustomUsers, usePeoplePicker } from '../../shared/Hooks';
import { SetCustomUsersRequestData, useApi } from "../../shared/api/Api";
import { AppSettings } from "../../AppSettings";
import { User } from "../../shared/Models";
import { RouteNames } from "../../shared/Consts";
import { Redirect } from "react-router-dom";

export const AdminPanelUsers: React.FC = () => {
  const [customUsers, customUsersFetching] = useCustomUsers();

  if (customUsersFetching) {
    return <Loader />
  }

  if (!customUsers) {
    return <Redirect to={RouteNames.error} />
  }

  return <AdminPanelUsersForm users={customUsers} />
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

  const onFilterChanged = (
    filter: string,
    selectedItems?: IPersonaProps[]
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
    return api.get<User[]>(`${AppSettings.API.Users.Base}?search=${filter.trim()}`)
    .then(res => mapUsersToPersona(res.data))
    .then(people => filterPeople(filter, people, selectedItems))
    .catch(err => {
      setErrorMessage(err.data);
      return [];
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

  //#region Messages

  const errorMessageBar = <MessageBar messageBarType={MessageBarType.error}>{errorMessage}</MessageBar>
  const successMessageBar = <MessageBar messageBarType={MessageBarType.success}>Zapisano.</MessageBar>

  //#endregion

  return (
    <AdminPanel>
      {errorMessage ? errorMessageBar : null}
      {success ? successMessageBar : null}
      <StackItem tokens={tokens}>
        <PeoplePicker
          required={true}
          label="Użytkownicy niestandardowi"
          name="users"
          control={control}
          people={users}
          selectedPeople={selectedUsers}
          onChange={onChangeSelectedUsers}
          maxSuggestions={5}
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

//#region Styles

const tokens: IStackTokens = { childrenGap: 15 };

//#endregion