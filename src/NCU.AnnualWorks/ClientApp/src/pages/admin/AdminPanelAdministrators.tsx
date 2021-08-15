import React, { useState } from "react";
import { mapUsersToPersona } from "../../shared/Utils";
import { IPersonaProps, IStackTokens, Label, MessageBar, MessageBarType, Persona, PrimaryButton, StackItem } from "@fluentui/react";
import { useForm } from "react-hook-form";
import { PeoplePicker, AdminPanel, Loader, filterPeople } from '../../Components';
import { useAdmins, useDefaultAdmin, usePeoplePicker } from '../../shared/Hooks';
import { SetAdminsRequestData, useApi } from "../../shared/api/Api";
import { AppSettings } from "../../AppSettings";
import { User } from "../../shared/Models";
import { RouteNames } from "../../shared/Consts";
import { Redirect } from "react-router-dom";

export const AdminPanelAdministrators: React.FC = () => {
  const [admins, adminsFetching] = useAdmins();
  const [defaultAdmin, defaultAdminFetching] = useDefaultAdmin();

  if (adminsFetching || defaultAdminFetching) {
    return <Loader />
  }

  if (!admins || !defaultAdmin) {
    return <Redirect to={RouteNames.error} />
  }

  return <AdminPanelAdministratorsForm admins={admins.filter(p => p.usosId !== defaultAdmin.usosId)} defaultAdmin={defaultAdmin} />
}

export default AdminPanelAdministrators;

interface Form {
  administrators: IPersonaProps[]
}

interface AdminPanelAdministratorsFormProps {
  admins: User[],
  defaultAdmin: User,
}

const AdminPanelAdministratorsForm: React.FC<AdminPanelAdministratorsFormProps> = (props) => {
  const api = useApi();
  const [admins, selectedAdmins, onChangeSelectedAdmins] = usePeoplePicker(props.admins);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [success, setIsSuccess] = useState<boolean>();

  const { handleSubmit, control } = useForm<Form, any>({
    defaultValues: {
      administrators: mapUsersToPersona(props.admins)
    },
    reValidateMode: "onSubmit",
    mode: "all"
  });

  const onFilterChanged = (filter: string, selectedItems?: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> => {
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
        const request: SetAdminsRequestData = {
          userIds: values.administrators.map<string>(u => u.key!.toString())
        }
        api.put(AppSettings.API.Users.Admins.Base, request)
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

  const errorMessageBar = <MessageBar messageBarType={MessageBarType.error}>{errorMessage}</MessageBar>;
  const successMessageBar = <MessageBar messageBarType={MessageBarType.success}>Zapisano.</MessageBar>;

  return (
    <AdminPanel>
      {errorMessage ? errorMessageBar : null}
      {success ? successMessageBar : null}
      <StackItem tokens={tokens}>
        <Label>Główny administrator</Label>
        <Persona
          key={props.defaultAdmin.usosId}
          text={`${props.defaultAdmin.firstName} ${props.defaultAdmin.lastName}`}
          secondaryText={props.defaultAdmin.email}
          imageUrl={props.defaultAdmin.photoUrl}
          imageAlt={`${props.defaultAdmin.firstName} ${props.defaultAdmin.lastName}`}
        />
      </StackItem>
      <StackItem tokens={tokens}>
        <PeoplePicker
          required={true}
          label="Administratorzy"
          name="administrators"
          control={control}
          people={admins}
          selectedPeople={selectedAdmins}
          onChange={onChangeSelectedAdmins}
          maxSuggestions={5}
          resolveDelay={500}
          onFilterChanged={onFilterChanged}
          defaultValue={mapUsersToPersona(props.admins)}
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