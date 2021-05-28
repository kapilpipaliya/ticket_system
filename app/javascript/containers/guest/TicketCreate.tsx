import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import 'jodit';
import 'jodit/build/jodit.min.css';
import { IJodit } from 'jodit';
import JoditEditor from 'jodit-react';
import { useMutation } from 'react-query';

import { CurrentUser } from '../Types';
import { DisplayFormError } from '../../components/input_errors/DisplayFormError';
import { emptyErrorState, ticketCreate } from '../../services/serviceTicket';
import { fetchCurrentUser } from '../../services/serviceUser';
import { LoadingButton } from '../../components/button/LoadingButton';
import { Alert } from '../../components/alert/Alert';
import { Input } from '../../components/input/Input';
import { Card, CardBody } from '../../components/card/Card';
import styles from './TicketCreate.module.scss';

export const TicketCreate = () => {
  const [isSuccess, setIsSuccess] = useState(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const nameOfSubmitterRef = useRef<HTMLInputElement>(null);
  const emailOfSubmitterRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [errors, setErrors] = useState({ ...emptyErrorState });
  const config: Partial<IJodit['options']> = {
    readonly: false,
    style: { height: 300 },
  };

  useEffect(() => {
    fetchCurrentUser().then(resp => setCurrentUser(resp));
  }, []);

  const newTicketMutation = useMutation(async () => {
    const result = await ticketCreate({
      subject: subjectRef.current.value,
      name: nameOfSubmitterRef.current.value,
      email: emailOfSubmitterRef.current.value,
      description,
      creator_id: currentUser ? currentUser.id : currentUser,
    });
    if (result.id) {
      subjectRef.current.value = '';
      nameOfSubmitterRef.current.value = '';
      emailOfSubmitterRef.current.value = '';
      setDescription('');
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
      setErrors({ ...emptyErrorState });
    } else {
      setErrors({ ...emptyErrorState, ...result });
    }
  });

  const handleSubmitForm = e => {
    e.preventDefault();
    newTicketMutation.mutate();
  };

  return (
    <div className={styles.container}>
      <div>
        {isSuccess && (
          <Alert variant="custom-alert-primary">
            <div className={styles.alertContainer}>
              <h5>Thank you for submitting a ticket!</h5>
              <p>We will reply soon...</p>
            </div>
          </Alert>
        )}
        <Card>
          <CardBody>
            <form onSubmit={handleSubmitForm}>
              <div className={styles.newTicketForm}>
                <label className={styles.alignCenter}>Name</label>
                <div>
                  <Input type="text" placeholder="John" ref={nameOfSubmitterRef} />
                  <DisplayFormError errors={errors.name} />
                </div>

                <label className={styles.alignCenter}>Email</label>
                <div>
                  <Input type="email" placeholder="john@example.com" ref={emailOfSubmitterRef} />
                  <DisplayFormError errors={errors.email} />
                </div>

                <label className={styles.alignCenter}>Subject</label>
                <div>
                  <Input type="text" placeholder="I did not received burger." ref={subjectRef} />
                  <DisplayFormError errors={errors.subject} />
                </div>

                <label className={styles.descriptionLabel}>Description</label>
                <div className={styles.description}>
                  <JoditEditor key={2} value={description} config={config as any} onBlur={setDescription} />
                  <DisplayFormError errors={errors.description} />
                </div>

                <div className={styles.submitButton}>
                  <LoadingButton onClick={handleSubmitForm} loading={newTicketMutation.isLoading}>
                    Submit
                  </LoadingButton>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
