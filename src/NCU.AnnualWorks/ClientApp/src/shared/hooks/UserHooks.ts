import { useEffect, useState } from 'react';
import { Api } from '../api/Api';
import { AppSettings } from '../../AppSettings';
import { User } from '../../shared/Models';
import { IPersonaProps } from '@fluentui/react';
import { useIsAuthenticated } from './AuthHooks';

const useUsers = <T>(endpoint: string, query?: string): [T | undefined, boolean] => {
  const [users, setUsers] = useState<T>();
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated === null) {
      return;
    }

    if (!isAuthenticated) {
      setIsFetching(false);
      return;
    }

    Api.get<T>(endpoint)
      .then(response => {
        setUsers(response.data);
        setIsFetching(false);
      })
      .catch(error => {
        console.error(error);
        setIsFetching(false);
      });
  }, [isAuthenticated]);

  return [users, isFetching];
};

export const useStudents = () => useUsers<User[]>(AppSettings.API.Users.Students);
export const useEmployees = () => useUsers<User[]>(AppSettings.API.Users.Employees);
export const useAdmins = () => useUsers<User[]>(AppSettings.API.Users.Admins.Base);
export const useDefaultAdmin = () => useUsers<User>(AppSettings.API.Users.Admins.Default);
export const useCustomUsers = () => useUsers<User[]>(AppSettings.API.Users.Custom);
export const useAllUsers = () => useUsers<User[]>(AppSettings.API.Users.All);

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
    if (people) {
      setSelectedPeople(people);
    }
  };

  return [people, selectedPeople, onChange]
};