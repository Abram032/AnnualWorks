import { useEffect, useState } from 'react';
import Api from '../api/Api';
import { AppSettings } from '../../AppSettings';
import User from '../../shared/models/User';
import { IPersonaProps } from '@fluentui/react';

const useUsers = (endpoint: string) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    Api.get<User[]>(endpoint)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return users;
};

export const useStudents = () => useUsers(AppSettings.API.Users.Students);
export const useEmployees = () => useUsers(AppSettings.API.Users.Employees);

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