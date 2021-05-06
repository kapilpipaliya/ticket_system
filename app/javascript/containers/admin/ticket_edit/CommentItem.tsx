import { CommentType, CurrentUser } from '../../Types';
import * as React from 'react';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { submitCommentEdit } from '../../../services/serviceComment';
import { NewComponentForm } from './NewComponentForm';
import { Card, Col, Row } from 'react-bootstrap';
import { Edit2, Trash2 } from 'react-feather';

const initialErrorState = () => {
  return { title: [] as string[], description: [] as string[] };
};

export function CommentItem(props: { comment: CommentType; onClick: () => void; ticketId: number; currentUser: CurrentUser; reFetchComment: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState(initialErrorState());

  const editCommentMutation = useMutation(async (data: any) => {
    const result = await submitCommentEdit(props.comment.id, {
      title: data.title,
      description: data.description,
      //ticket_id: props.ticketId,
      //commenter_id: props.currentUser ? props.currentUser.id : props.currentUser,
    });
    if (result && result.id) {
      //replySubjectRef.current.value = '';
      //setDescription('');
      await props.reFetchComment();
      setIsEditing(false);
      setErrors(initialErrorState());
    } else {
      setErrors({ ...initialErrorState(), ...result });
    }
    return result;
  });
  return (
    <>
      {isEditing ? (
        <NewComponentForm
          key={2}
          onSubmit={editCommentMutation.mutate}
          comment={props.comment}
          errors={errors}
          loading={editCommentMutation.isLoading}
          toggleComment={() => setIsEditing(false)}
        />
      ) : (
        <Card.Body className="hd-detail hdd-admin border-bottom">
          <Row>
            <Col sm="auto">
              <p>
                <i className="fas fa-thumbs-up mr-1 text-primary" />#{props.comment.id}
              </p>
            </Col>
            <Col>
              <div className="comment-top">
                <h4>
                  {props.comment.commenter_name} <small className="text-muted f-w-400">replied</small>
                </h4>
                <p>{new Date(props.comment.created_at).toUTCString()}</p>
              </div>
              <div dangerouslySetInnerHTML={{ __html: props.comment.description }}></div>
            </Col>
            <Col sm="auto" className="pl-0 col-right">
              <Card.Body className="text-center">
                <ul className="list-unstyled mb-0 edit-del">
                  <li className="d-inline-block f-20 mr-1">
                    <span>
                      <Edit2 className={'text-muted'} style={{ cursor: 'pointer' }} onClick={() => setIsEditing(true)} />
                    </span>
                  </li>
                  <li className="d-inline-block f-20">
                    <span>
                      <Trash2 className={'text-muted'} style={{ cursor: 'pointer' }} onClick={props.onClick} />
                    </span>
                  </li>
                </ul>
              </Card.Body>
            </Col>
          </Row>
        </Card.Body>
      )}
    </>
  );
}
