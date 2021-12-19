import { CurrentUser, User } from '../containers/Types';
import { routes } from './routes';

export const fetchCurrentUser = async (): Promise<CurrentUser | null> => {
  try {
    const response = await fetch(routes.routes['profile']);
    return await response.json();
  } catch (err) {
    alert(err);
    return null;
  }
};

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(routes.routes['users']);
    return await response.json();
  } catch (err) {
    alert(err);
    return null;
  }
};
