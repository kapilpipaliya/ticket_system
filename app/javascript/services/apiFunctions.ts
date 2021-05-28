export const post = async (url: string, data: { [key: string]: any }) => {
  const csrfToken = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-CSRF-TOKEN': csrfToken,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const patch = async (url: string, data: { [key: string]: any }) => {
  const csrfToken = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'X-CSRF-TOKEN': csrfToken,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};

export const deleteApi = async (url: string) => {
  const csrfToken = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'X-CSRF-TOKEN': csrfToken,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  return await response.json();
};
