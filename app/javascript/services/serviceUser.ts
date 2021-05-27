import { CurrentUser, User } from '../containers/Types';

export const fetchCurrentUser = async (): Promise<CurrentUser | null> => {
  const csrfToken = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content;
  try {
    const response = await fetch('/api/v1/users/profile');
    return await response.json();
  } catch (err) {
    alert(err);
    return null;
  }
};

export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch('/api/v1/users');
    return await response.json();
  } catch (err) {
    alert(err);
    return null;
  }
};
