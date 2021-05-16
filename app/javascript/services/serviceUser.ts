import { CurrentUser, User } from '../containers/Types';

export const fetchCurrentUser = async (): Promise<CurrentUser | null> => {
  const csrfToken = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content;
  try {
    const response = await fetch('/api/user', {
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return await response.json();
  } catch (err) {
    alert(err);
    return null;
  }
};

export const fetchAllUsers = async (): Promise<User[]> => {
  const csrfToken = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content;
  try {
    const response = await fetch('/api/users/all', {
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return await response.json();
  } catch (err) {
    alert(err);
    return null;
  }
};
