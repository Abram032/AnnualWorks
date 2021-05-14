import { useEffect, useState } from 'react';
import Api from '../api/Api';
import { AppSettings } from '../../AppSettings';
import User from '../../shared/models/User';

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
}

export const useStudents = () => useUsers(AppSettings.API.Users.Students);
export const useEmployees = () => useUsers(AppSettings.API.Users.Employees);