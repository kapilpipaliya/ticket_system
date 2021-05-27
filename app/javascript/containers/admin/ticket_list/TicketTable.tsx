import * as React from 'react';
import clsx from 'clsx';
import { Edit, Eye, Trash2 } from 'react-feather';

import { Pagy, SortDirection, SortState, Ticket } from '../../Types';
import { getLocalTimeDate } from '../../utils';
import styles from './TicketList.module.scss';

interface TicketItemProps {
  ticket: Ticket;
  onDelete: () => void;
}

export const TicketItem = (props: TicketItemProps) => {
  const { ticket, onDelete } = props;
  return (
    <>
      <td>{ticket.name}</td>
      <td>{ticket.email}</td>
      <td className={clsx(styles.subjectTruncate, styles.textTruncate)} title={ticket.description}>
        {ticket.subject}
      </td>
      <td>{ticket.assignee_name}</td>
      <td>{ticket.status}</td>
      <td>{ticket.sentiment}</td>
      <td>{ticket.assignee_comments}</td>
      <td>{getLocalTimeDate(new Date(ticket.created_at))}</td>
      <td>{getLocalTimeDate(new Date(ticket.last_activity))}</td>
      <td className={styles.actionColumn}>
        <a href={`tickets/${ticket.id}`} className="text-muted">
          <Eye className={styles.actionIcon} />
        </a>
        <a href={`tickets/${ticket.id}/edit`} className="text-muted">
          <Edit className={styles.actionIcon} />
        </a>
        <Trash2 className={styles.cursorPointer} onClick={onDelete} />
      </td>
    </>
  );
};

interface TicketTableProps {
  sortState: SortState;
  handleOnSortClick: (column_id: string, order?: SortDirection) => (e?: React.MouseEvent) => void;
  ticketData: { data: Ticket[]; pagy: Pagy };
  onTicketDeleteConfirm: (ticketId: number) => () => void;
}

export const TicketTable = (props: TicketTableProps) => {
  const { sortState, handleOnSortClick, onTicketDeleteConfirm, ticketData } = props;
  const SortIcon = (p: { id: string }) => {
    if (sortState[p.id] === SortDirection.Ascending) return <>▲</>;
    if (sortState[p.id] === SortDirection.Descending) return <>▼</>;
    return <></>;
  };
  return (
    <div className={styles.tableResponsive}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={handleOnSortClick('name')}>
              Name <SortIcon id={'name'} />
            </th>
            <th onClick={handleOnSortClick('email')}>
              Email <SortIcon id={'email'} />
            </th>
            <th onClick={handleOnSortClick('subject')}>
              Subject <SortIcon id={'subject'} />
            </th>
            <th onClick={handleOnSortClick('assignee_id')}>
              Assigned to <SortIcon id={'assignee_id'} />
            </th>
            <th onClick={handleOnSortClick('status')}>
              Status <SortIcon id={'status'} />
            </th>
            <th onClick={handleOnSortClick('sentiment')}>
              Sentiment <SortIcon id={'sentiment'} />
            </th>
            <th onClick={handleOnSortClick('assignee_comments')}>
              Comments <SortIcon id={'assignee_comments'} />
            </th>
            <th onClick={handleOnSortClick('created_at')}>
              Created <SortIcon id={'created_at'} />
            </th>
            <th onClick={handleOnSortClick('last_activity')}>
              Last Activity <SortIcon id={'last_activity'} />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ticketData.data.map(item => (
            <tr key={item.id}>
              <TicketItem ticket={item} onDelete={onTicketDeleteConfirm(item.id)} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
