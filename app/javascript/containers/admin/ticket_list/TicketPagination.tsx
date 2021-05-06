import { Pagy, Ticket } from '../../Types';
import { Pagination } from 'react-bootstrap';
import * as React from 'react';

export const TicketPagination = (props: { handlePageChange: (page_number: number | string) => () => void; ticketData: { data: Ticket[]; pagy: Pagy } }) => {
  const { ticketData, handlePageChange } = props;
  return (
    <div className="pagination-block text-center">
      <nav aria-label="Page navigation example" className="d-inline-block">
        <Pagination>
          {/*@ts-ignore*/}
          <Pagination.First onClick={handlePageChange(1)} disabled={!props.ticketData.pagy.prev} />
          {/*@ts-ignore*/}
          <Pagination.Prev onClick={handlePageChange(ticketData.pagy.prev)} disabled={!props.ticketData.pagy.prev} />
          {(props.ticketData.pagy.series || []).map(x => {
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
          <Pagination.Next onClick={handlePageChange(ticketData.pagy.next)} disabled={!props.ticketData.pagy.next} />
          {/*@ts-ignore*/}
          <Pagination.Last onClick={handlePageChange(ticketData.pagy.last)} disabled={!props.ticketData.pagy.last || !props.ticketData.pagy.next} />
        </Pagination>
      </nav>
    </div>
  );
};
