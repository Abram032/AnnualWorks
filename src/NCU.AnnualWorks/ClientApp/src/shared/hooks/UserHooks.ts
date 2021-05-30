import { useEffect, useState } from 'react';
import { useApi } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import User from '../../shared/models/User';
import { IPersonaProps } from '@fluentui/react';

const useUsers = <T>(endpoint: string, query?: string) => {
  const api = useApi();
  const [users, setUsers] = useState<T>();

  useEffect(() => {
    api.get<T>(endpoint)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return users;
};

export const useStudents = () => useUsers<User[]>(AppSettings.API.Users.Students);
export const useEmployees = () => useUsers<User[]>(AppSettings.API.Users.Employees);
export const useAdmins = () => useUsers<User[]>(AppSettings.API.Users.Admins.Base);
export const useDefaultAdmin = () => useUsers<User>(AppSettings.API.Users.Admins.Default);
export const useCustomUsers = () => useUsers<User[]>(AppSettings.API.Users.Custom);

export const usePeoplePicker = (users: User[], excludedIds?: any[]): [IPersonaProps[], IPersonaProps[], (people?: IPersonaProps[]) => void] => {
  const [people, setPeople] = useState<IPersonaProps[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<IPersonaProps[]>([]);

  useEffect(() => {
    setPeople(users
      .filter(u => !excludedIds?.includes(u.usosId))
      .map<IPersonaProps>(u => ({
        key: u.usosId,
        text: `${u.firstName} ${u.lastName}`,
        secondaryText: u.email,
        imageUrl: u.photoUrl
      })));
  }, [users]);

  const onChange = (people?: IPersonaProps[]) => {
    if(people) {
      setSelectedPeople(people);
    }
  };

  return [people, selectedPeople, onChange]
};