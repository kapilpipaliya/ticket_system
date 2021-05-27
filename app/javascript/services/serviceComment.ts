import { CommentType } from '../containers/Types';
import { deleteApi, patch, post } from './apiFunctions';

export const fetchCommentData = async (ticketId: string): Promise<CommentType[]> => {
  try {
    const responseComments = await fetch(`/api/v1/comments/${ticketId}/by_ticket.json`);
    return await responseComments.json();
  } catch (err) {
    alert(err);
    return [];
  }
};

export const submitTicketReply = async (data): Promise<CommentType | null> => {
  try {
    const response = await post('/api/v1/comments', data);
    return await response.json();
  } catch (err) {
    alert(err);
    return null;
  }
};

export const submitCommentEdit = async (commentId, data: { [key: string]: any }): Promise<any> => {
  try {
    return await patch(`/api/v1/comments/${commentId}`, data);
  } catch (err) {
    alert(err);
    return null;
  }
};

export const deleteComment = async commentId => {
  try {
    return await deleteApi(`/api/v1/comments/${commentId}`);
  } catch (err) {
    alert(err);
  }
};
