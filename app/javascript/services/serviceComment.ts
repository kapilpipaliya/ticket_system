import { CommentType } from '../containers/Types';

export const fetchCommentData = async (ticketId: string): Promise<CommentType[]> => {
  try {
    const responseComments = await fetch(`/comments/by_ticket/${ticketId}.json`);
    return await responseComments.json();
  } catch (err) {
    alert(err);
    return [];
  }
};

export const submitTicketReply = async (data): Promise<CommentType | null> => {
  const csrfToken = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content;
  try {
    const response = await fetch('/comments', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (err) {
    alert(err);
    return null;
  }
};

export const submitCommentEdit = async (commentId, data: { [key: string]: any }): Promise<any> => {
  const csrfToken = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content;
  try {
    const response = await fetch(`/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (err) {
    alert(err);
    return null;
  }
};
export const deleteComment = async commentId => {
  const csrfToken = (document.querySelector('[name=csrf-token]') as HTMLMetaElement).content;
  try {
    const response = await fetch(`/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return await response.json();
  } catch (err) {
    alert(err);
  }
};
