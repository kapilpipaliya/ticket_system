import { CommentType } from '../../Types';
import * as React from 'react';
import { useState } from 'react';
import { IJodit } from 'jodit';
import JoditEditor from 'jodit-react';

import { DisplayFormError } from '../../../components/input_errors/DisplayFormError';
import { LoadingButton } from '../../../components/button/LoadingButton';
import { Button } from '../../../components/button/Button';
import { Card, CardBody } from '../../../components/card/Card';
import styles from './TicketEdit.module.scss';

interface NewComponentFormProps {
  comment: CommentType;
  loading: boolean;
  toggleComment: () => void;
  onSubmit: (data: any) => void;
  errors: { [key: string]: string[] };
}

export const NewComponentForm = (props: NewComponentFormProps) => {
  const { comment, loading, toggleComment, onSubmit, errors } = props;

  const [description, setDescription] = useState(comment.description);
  const config: Partial<IJodit['options']> = {
    readonly: false,
  };

  return (
    <div>
      <Card>
        <CardBody>
          <h5>Reply</h5>
          <div>
            <label>Description:</label>
            <JoditEditor value={description} config={config as any} onBlur={setDescription} />
            <div className={`${errors.description.length ? 'is-invalid' : ''}`} />
            <DisplayFormError errors={errors.description} />
          </div>

          <div className={styles.commentButtonGroup}>
            <LoadingButton
              variant="primary"
              onClick={() =>
                onSubmit({
                  description,
                })
              }
              loading={loading}
            >
              Send
            </LoadingButton>
            <Button variant="secondary" onClick={toggleComment}>
              Cancel
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
