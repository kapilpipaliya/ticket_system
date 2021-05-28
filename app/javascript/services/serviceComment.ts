import { CommentType } from '../containers/Types';
import { deleteApi, patch, post } from './apiFunctions';
import { routes } from './routes';

export const fetchCommentData = async (ticketId: string): Promise<CommentType[]> => {
  try {
    const responseComments = await fetch(`${routes.routes['comments_by_ticket'].replace(':id', ticketId)}`);
    return await responseComments.json();
  } catch (err) {
    alert(err);
    return [];
  }
};

export const submitTicketReply = async (data): Promise<CommentType | null> => {
  try {
    return await post(routes.routes['comments'], data);
  } catch (err) {
    alert(err);
    return null;
  }
};

export const submitCommentEdit = async (commentId, data: { [key: string]: any }): Promise<any> => {
  try {
    return await patch(`${routes.routes['comment'].replace(':id', commentId)}`, data);
  } catch (err) {
    alert(err);
    return null;
  }
};

export const deleteComment = async commentId => {
  try {
    return await deleteApi(`${routes.routes['comment'].replace(':id', commentId)}`);
  } catch (err) {
    alert(err);
  }
};
