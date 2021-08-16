import React, { useEffect, useState } from "react";
import { IStackTokens, MessageBar, MessageBarType, PrimaryButton, StackItem } from "@fluentui/react";
import { AppSettings } from "../../AppSettings";
import { SetCourseRequestData, useApi } from "../../shared/api/Api";
import { useCourse } from '../../shared/Hooks';
import { TextField, AdminPanel, Loader } from "../../Components";
import { useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";
import { RouteNames } from "../../shared/Consts";
import { scrollToTop } from "../../shared/Utils";

interface Form {
  courseCode: string,
}

export const AdminPanelCourse: React.FC = () => {
  const api = useApi();
  const [course, courseFetching] = useCourse();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [uploadSuccess, setUploadSuccess] = useState<boolean>();
  const { handleSubmit, control, setValue } = useForm<Form>({
    reValidateMode: "onSubmit",
    mode: "all",
  });

  if(courseFetching) {
    return <Loader />
  }

  if(!course) {
    return <Redirect to={RouteNames.error} />
  }

  const onSave = () => {
    setUploadSuccess(false);
    setErrorMessage(undefined);

    handleSubmit(
      (values) => {
        const request: SetCourseRequestData = {
          courseCode: values.courseCode
        }
        api.put(AppSettings.API.Course.Base, request)
          .then(res => {
            scrollToTop();
            setUploadSuccess(true);
          })
          .catch(err => {
            scrollToTop();
            setUploadSuccess(false);
            setErrorMessage(err.data);
          })
      },
      (err) => {
        setErrorMessage("Popraw błędy walidacyjne przed zmianą kursu.");
      }
    )();
  };

  //#region Messages

  const warningMessageBar = 
    <MessageBar messageBarType={MessageBarType.severeWarning}>
      Niektórzy użytkownicy mogą utracić dostęp do systemu po zmianie kursu.
    </MessageBar>
  const errorMessageBar = <MessageBar messageBarType={MessageBarType.error}>{errorMessage}</MessageBar>
  const successMessageBar = <MessageBar messageBarType={MessageBarType.success}>Nowy kurs został ustawiony.</MessageBar>

  //#endregion Messages

  return (
    <AdminPanel>
      {warningMessageBar}
      {uploadSuccess ? successMessageBar : null}
      {errorMessage ? errorMessageBar : null}
      <StackItem tokens={tokens}>
        <TextField
          control={control}
          name="courseCode"
          label="Podaj kod kursu"
          rules={{
            required: "Kod jest wymagany",
            validate: (value: string) => {
              if (value.length > 100) {
                return "Podany kod jest zbyt długi";
              }
            }
          }}
          defaultValue={course.courseCode}
          value={course.courseCode}
          required
        />
      </StackItem>
      <StackItem>
        <PrimaryButton text="Zatwierdź" onClick={onSave} />
      </StackItem>
    </AdminPanel>
  );
};

export default AdminPanelCourse;

//#region Styles

const tokens: IStackTokens = { childrenGap: 15 };

//#endregion