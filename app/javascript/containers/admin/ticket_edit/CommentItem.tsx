import { CommentType } from '../../Types';
import * as React from 'react';
import { useState } from 'react';
import { useMutation } from 'react-query';
import clsx from 'clsx';
import { Edit2, MessageSquare, Trash2 } from 'react-feather';

import { submitCommentEdit } from '../../../services/serviceComment';
import { NewComponentForm } from './NewComponentForm';
import { CardBody } from '../../../components/card/Card';
import styles from './TicketEdit.module.scss';

interface CommentItemProps {
  comment: CommentType;
  onClick?: () => void;
  reFetchComment?: () => void;
  editable: boolean;
}

export function CommentItem(props: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const { comment, onClick, reFetchComment, editable } = props;
  const editCommentMutation = useMutation(async (data: any) => {
    const result = await submitCommentEdit(comment.id, {
      description: data.description,
    });
    if (result && result.id) {
      await reFetchComment();
      setIsEditing(false);
      setErrors({});
    } else {
      setErrors({ ...result });
    }
    return result;
  });
  return (
    <>
      {editable && isEditing ? (
        <NewComponentForm
          key={2}
          onSubmit={editCommentMutation.mutate}
          comment={comment}
          errors={errors}
          loading={editCommentMutation.isLoading}
          toggleComment={() => setIsEditing(false)}
        />
      ) : (
        <CardBody className={clsx(styles.commentContainer, styles.borderBottom)}>
          <div className={styles.comment}>
            <div>
              <p className={styles.commentId}>
                <MessageSquare /> {comment.id}
              </p>
            </div>
            <div>
              <div>
                <h4>
                  {comment.commenter_name && (
                    <>
                      {comment.commenter_name} <small className={styles.mutatedText}>replied</small>
                    </>
                  )}
                </h4>
                <p>{new Date(comment.created_at).toUTCString()}</p>
                <p>
                  Sentiment: {comment.sentiment} ({comment.sentiment_score})
                </p>
              </div>
              <div dangerouslySetInnerHTML={{ __html: comment.description }}></div>
            </div>
            <CardBody>
              {editable && (
                <ul className={clsx(styles.editDel)}>
                  <li className={clsx(styles.commentAction, styles.firstCommentAction)}>
                    <span>
                      <Edit2 className={styles.commentActionIcon} onClick={() => setIsEditing(true)} />
                    </span>
                  </li>
                  <li className={styles.commentAction}>
                    <span>
                      <Trash2 className={styles.commentActionIcon} onClick={onClick} />
                    </span>
                  </li>
                </ul>
              )}
            </CardBody>
          </div>
        </CardBody>
      )}
    </>
  );
}
