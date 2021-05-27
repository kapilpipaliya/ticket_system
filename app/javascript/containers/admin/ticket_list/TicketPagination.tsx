import * as React from 'react';
import { Pagination } from 'react-bootstrap';

import { Pagy, Ticket } from '../../Types';
import styles from './TicketList.module.scss';

export const TicketPagination = (props: { handlePageChange: (page_number: number | string) => () => void; ticketData: { data: Ticket[]; pagy: Pagy } }) => {
  const { ticketData, handlePageChange } = props;
  return (
    <div className={styles.pagination}>
      <nav>
        <Pagination>
          {/*@ts-ignore*/}
          <Pagination.First onClick={handlePageChange(1)} disabled={!ticketData.pagy.prev} />
          {/*@ts-ignore*/}
          <Pagination.Prev onClick={handlePageChange(ticketData.pagy.prev)} disabled={!ticketData.pagy.prev} />
          {(ticketData.pagy.series || []).map(x => {
            if (typeof x == 'string' && x != 'gap')
              return (
                <Pagination.Item key={x} active onClick={handlePageChange(x)}>
                  {x}
                </Pagination.Item>
              );
            if (typeof x == 'number')
              return (
                <Pagination.Item key={x} onClick={handlePageChange(x)}>
                  {x}
                </Pagination.Item>
              );
            if (x == 'gap') return <Pagination.Ellipsis key={x} disabled />;
            return <div key={x}>Error</div>;
          })}
          {/*@ts-ignore*/}
          <Pagination.Next onClick={handlePageChange(ticketData.pagy.next)} disabled={!ticketData.pagy.next} />
          {/*@ts-ignore*/}
          <Pagination.Last onClick={handlePageChange(ticketData.pagy.last)} disabled={!ticketData.pagy.last || !ticketData.pagy.next} />
        </Pagination>
      </nav>
    </div>
  );
};
