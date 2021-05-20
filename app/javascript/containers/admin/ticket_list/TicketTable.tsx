import { Pagy, SortDirection, SortState, Ticket } from '../../Types';
import * as React from 'react';
import { Table } from 'react-bootstrap';
import { Edit, Eye, Trash2 } from 'react-feather';

interface TicketItemProps {
  ticket: Ticket;
  onDelete: () => void;
}

export const TicketItem = (props: TicketItemProps) => {
  return (
    <>
      <td className={'whitespace-nowrap'}>{props.ticket.name}</td>
      <td className={'whitespace-nowrap'}>{props.ticket.email}</td>
      <td className={'text-truncate'} style={{ maxWidth: 300 }} title={props.ticket.description}>
        {props.ticket.subject}
      </td>
      <td className={'whitespace-nowrap'}>{props.ticket.assignee_name}</td>
      <td className={'whitespace-nowrap'}>{props.ticket.status}</td>
      <td className={'whitespace-nowrap'}>{props.ticket.sentiment}</td>
      <td className={'whitespace-nowrap'}>{props.ticket.assignee_comments}</td>
      <td className={'whitespace-nowrap'}>{new Date(props.ticket.created_at).toLocaleString()}</td>
      <td className={'whitespace-nowrap'}>{new Date(props.ticket.last_activity).toLocaleString()}</td>
      <td style={{ display: 'flex', flexWrap: 'nowrap' }}>
        <a href={`tickets/${props.ticket.id}`} className="text-muted">
          <Eye className={'me-1'} />
        </a>
        <a href={`tickets/${props.ticket.id}/edit`} className="text-muted">
          <Edit className={'me-1'} />
        </a>
        <Trash2 style={{ cursor: 'pointer' }} onClick={props.onDelete} />
      </td>
    </>
  );
};
export const TicketTable = (props: {
  sortState: SortState;
  handleOnSortClick: (column_id: string, order?: SortDirection) => (e?: React.MouseEvent) => void;
  ticketData: { data: Ticket[]; pagy: Pagy };
  onTicketDeleteConfirm: (ticketId: number) => () => void;
}) => {
  const { sortState, handleOnSortClick, onTicketDeleteConfirm } = props;
  const SortIcon = (p: { id: string }) => {
    if (sortState[p.id] === SortDirection.Ascending) return <>▲</>;
    if (sortState[p.id] === SortDirection.Descending) return <>▼</>;
    return <></>;
  };
  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th className="border-top-0" onClick={handleOnSortClick('name')}>
            Name <SortIcon id={'name'} />
          </th>
          <th className="border-top-0" onClick={handleOnSortClick('email')}>
            Email <SortIcon id={'email'} />
          </th>
          <th className="border-top-0" onClick={handleOnSortClick('subject')}>
            Subject <SortIcon id={'subject'} />
          </th>
          <th className="border-top-0" style={{ whiteSpace: 'nowrap' }} onClick={handleOnSortClick('assignee_id')}>
            Assigned to <SortIcon id={'assignee_id'} />
          </th>
          <th className="border-top-0" style={{ whiteSpace: 'nowrap' }} onClick={handleOnSortClick('status')}>
            Status <SortIcon id={'status'} />
          </th>
          <th className="border-top-0" style={{ whiteSpace: 'nowrap' }} onClick={handleOnSortClick('sentiment')}>
            Sentiment <SortIcon id={'sentiment'} />
          </th>
          <th className="border-top-0" onClick={handleOnSortClick('assignee_comments')}>
            Comments <SortIcon id={'assignee_comments'} />
          </th>
          <th className="border-top-0" onClick={handleOnSortClick('created_at')}>
            Created <SortIcon id={'created_at'} />
          </th>
          <th className="border-top-0" style={{ whiteSpace: 'nowrap' }} onClick={handleOnSortClick('last_activity')}>
            Last Activity <SortIcon id={'last_activity'} />
          </th>
          <th className="border-top-0">Actions</th>
        </tr>
      </thead>
      <tbody>
        {props.ticketData.data.map(item => {
          return (
            <tr key={item.id}>
              <TicketItem ticket={item} onDelete={onTicketDeleteConfirm(item.id)} />
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
