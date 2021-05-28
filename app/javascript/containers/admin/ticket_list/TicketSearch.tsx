import * as React from 'react';

import { SearchState } from '../../Types';
import { LoadingButton } from '../../../components/button/LoadingButton';
import { Button } from '../../../components/button/Button';
import { Input } from '../../../components/input/Input';
import { Select } from '../../../components/select/Select';
import styles from './TicketList.module.scss';

interface TicketSearchProps {
  searchConfig: {
    searchState: SearchState;
    setSearchState: React.Dispatch<React.SetStateAction<SearchState>>;
  };
  statusConfig: {
    status: string | number;
    setStatus: React.Dispatch<React.SetStateAction<string | number>>;
    statusOptions: any[];
  };
  sentimentConfig: {
    sentiment: string | number;
    setSentiment: React.Dispatch<React.SetStateAction<string | number>>;
    sentimentOptions: any[];
  };
  onSubmit: () => void;
  loading: boolean;
  onReset: () => void;
}

export const TicketSearch = (props: TicketSearchProps) => {
  const {
    searchConfig: { searchState, setSearchState },
    statusConfig: { status, setStatus, statusOptions },
    sentimentConfig: { sentiment, setSentiment, sentimentOptions },
    onSubmit,
    loading,
    onReset,
  } = props;

  return (
    <div className={styles.ticketSearchForm}>
      <label>Name</label>
      <Input placeholder="John" type="text" value={searchState.name} onChange={e => setSearchState(prevState => ({ ...prevState, name: e.target.value }))} />

      <label>Email</label>
      <Input placeholder="john@example.com" type="text" value={searchState.email} onChange={e => setSearchState(prevState => ({ ...prevState, email: e.target.value }))} />

      <label>Subject</label>
      <Input placeholder="order status" type="text" value={searchState.subject} onChange={e => setSearchState(prevState => ({ ...prevState, subject: e.target.value }))} />

      <label>Description</label>
      <Input placeholder="description" type="text" value={searchState.description} onChange={e => setSearchState(prevState => ({ ...prevState, description: e.target.value }))} />

      <label>Status</label>
      <Select value={status} onChange={e => setStatus(e.target.value)}>
        {statusOptions.map(s => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </Select>

      <label>Sentiment</label>
      <Select value={sentiment} onChange={e => setSentiment(e.target.value)}>
        {sentimentOptions.map(s => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </Select>
      <div className={styles.buttonGroup}>
        <LoadingButton className={styles.searchSubmitButton} onClick={onSubmit} loading={loading} showSpinner={false}>
          Search
        </LoadingButton>
        <Button variant="secondary" onClick={onReset} disabled={loading}>
          Reset
        </Button>
      </div>
    </div>
  );
};
