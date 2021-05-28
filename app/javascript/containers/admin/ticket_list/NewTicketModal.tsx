import { CurrentUser, Ticket } from '../../Types';
import * as React from 'react';
import { useRef, useState } from 'react';
import { IJodit } from 'jodit';
import { Trello } from 'react-feather';
import { useMutation } from 'react-query';
import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from 'jodit-react';

import { emptyErrorState, ticketCreate } from '../../../services/serviceTicket';
import { DisplayFormError } from '../../../components/input_errors/DisplayFormError';
import { LoadingButton } from '../../../components/button/LoadingButton';
import { Button } from '../../../components/button/Button';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '../../../components/modal/Modal';
import { Input } from '../../../components/input/Input';
import styles from './TicketList.module.scss';

interface NewTicketModalProps {
  show: boolean;
  onHide: () => void;
  onNewTicket: (ticket: Ticket) => void;
  currentUser: CurrentUser;
}

export const NewTicketModal = (props: NewTicketModalProps) => {
  const subjectRef = useRef<HTMLInputElement>(null);
  const nameOfSubmitterRef = useRef<HTMLInputElement>(null);
  const emailOfSubmitterRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ ...emptyErrorState });
  const { show, onHide, onNewTicket, currentUser } = props;
  const config: Partial<IJodit['options']> = {
    readonly: false,
    style: { height: 300 },
  };

  const mutation = useMutation(async () => {
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
      setErrors({ ...emptyErrorState });
      onHide();
      onNewTicket(result as Ticket);
    } else {
      setErrors({ ...emptyErrorState, ...result });
    }
    return result;
  });

  const handleSubmitForm = e => {
    e.preventDefault();
    mutation.mutate();
  };

  const onClear = () => {
    subjectRef.current.value = '';
    nameOfSubmitterRef.current.value = '';
    emailOfSubmitterRef.current.value = '';
    setDescription('');
    onHide();
  };

  return (
    <>
      {show && (
        <Modal>
          <ModalBody onHide={onHide}>
            <ModalHeader>
              <div className={styles.newTicketTitle}>
                <Trello />
                Add Ticket
              </div>
            </ModalHeader>

            <div className={styles.newTicketForm}>
              <label>Name</label>
              <div>
                <Input type="text" placeholder="Name" value={currentUser.first_name} ref={nameOfSubmitterRef} disabled />
                <DisplayFormError errors={errors.name} />
              </div>

              <label>Email</label>
              <div>
                <Input type="email" placeholder="Email" value={currentUser.email} ref={emailOfSubmitterRef} disabled />
                <DisplayFormError errors={errors.email} />
              </div>

              <label>Subject</label>
              <div>
                <Input type="text" placeholder="I did not received burger." ref={subjectRef} />
                <DisplayFormError errors={errors.subject} />
              </div>

              <label className={styles.descriptionLabel}>Description</label>
              <div className={styles.description}>
                <JoditEditor key={2} value={description} config={config as any} onBlur={setDescription} />
                <DisplayFormError errors={errors.description} />
              </div>
            </div>

            <ModalFooter className={styles.newTicketButtonGroup}>
              <Button variant="danger" onClick={onClear}>
                Cancel
              </Button>
              <LoadingButton onClick={handleSubmitForm} loading={mutation.isLoading}>
                Submit
              </LoadingButton>
            </ModalFooter>
          </ModalBody>
        </Modal>
      )}
    </>
  );
};
