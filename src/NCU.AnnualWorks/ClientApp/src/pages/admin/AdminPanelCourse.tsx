import React, { useEffect, useState } from "react";
import AdminPanel from './AdminPanel';
import { RouteNames } from "../../shared/consts/RouteNames";
import { IStackTokens, MessageBar, MessageBarType, PrimaryButton, StackItem } from "@fluentui/react";
import { AppSettings } from "../../AppSettings";
import { SetCourseRequestData, useApi } from "../../shared/api/Api";
import { useCourse } from '../../shared/hooks/CourseHooks';
import ControlledTextField from "../../components/textField/ControlledTextField";
import { useForm } from "react-hook-form";

interface Form {
  courseCode: string,
}

export const AdminPanelCourse: React.FC = () => {
  const course = useCourse();
  const api = useApi();

  const [errorMessage, setErrorMessage] = useState<string>();
  const [success, setIsSuccess] = useState<boolean>();

  const { handleSubmit, control, setValue } = useForm<Form>({
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const onSave = () => {
    setIsSuccess(false);
    setErrorMessage(undefined);
    
    handleSubmit(
      (values) => {
        const request: SetCourseRequestData = {
          courseCode: values.courseCode
        }
        api.put(AppSettings.API.Course.Base, request)
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

  useEffect(() => {
    if(course) {
      setValue("courseCode", course.courseCode);
    }
  }, [course]);

  const warningMessageBar = (
    <MessageBar messageBarType={MessageBarType.severeWarning}>
      Niektórzy użytkownicy mogą utracić dostęp do systemu po zmianie kursu.
    </MessageBar>
  );

  const errorMessageBar = (
    <MessageBar messageBarType={MessageBarType.error}>
      {errorMessage}
    </MessageBar>
  )

  const successMessageBar = (
    <MessageBar messageBarType={MessageBarType.success}>
      Nowy kurs został ustawiony.
    </MessageBar>
  );

  const tokens: IStackTokens = { childrenGap: 15 };

  return (
    <AdminPanel>
      {warningMessageBar}
      {success ? successMessageBar : null}
      {errorMessage ? errorMessageBar : null}
      <StackItem tokens={tokens}>
        <ControlledTextField
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
          value={course?.courseCode}
          //defaultValue={course?.courseCode}
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