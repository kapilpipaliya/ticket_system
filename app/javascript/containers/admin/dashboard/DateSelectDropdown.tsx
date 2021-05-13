import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { Filter } from 'react-feather';

import { endOfDay, startOfISOWeek, startOfMonth, startOfYear, sub } from 'date-fns';

interface DateSelectDropdownProps {
  handleRangeSelect: (startDate: Date, endDate: Date) => void;
}
export const DateSelectDropdown = (props: DateSelectDropdownProps) => {
  const handleTodayClick = () => {
    const endDate = endOfDay(new Date());
    props.handleRangeSelect(sub(endDate, { days: 1 }), endDate);
  };
  const handleThisWeekClick = () => {
    const endDate = endOfDay(new Date());
    props.handleRangeSelect(sub(endDate, { weeks: 1 }), endDate);
  };
  const handleLastWeekClick = () => {
    const endDate = startOfISOWeek(new Date());
    props.handleRangeSelect(sub(endDate, { weeks: 1 }), endDate);
  };
  const handleThisMonthClick = () => {
    const endDate = endOfDay(new Date());
    props.handleRangeSelect(sub(endDate, { months: 1 }), endDate);
  };
  const handleLastMonthClick = () => {
    const endDate = startOfMonth(new Date());
    props.handleRangeSelect(sub(endDate, { weeks: 1 }), endDate);
  };
  const handleYearToDateClick = () => {
    const endDate = endOfDay(new Date());
    props.handleRangeSelect(sub(endDate, { years: 1 }), endDate);
  };
  const handleLastYearClick = () => {
    const endDate = startOfYear(new Date());
    props.handleRangeSelect(sub(endDate, { years: 1 }), endDate);
  };
  const [selectedRange, setSelectedRange] = useState('This Month');
  const options = {
    today: {
      label: 'Today',
      onClick: () => {
        setSelectedRange('Today');
        handleTodayClick();
      },
    },
    this_week: {
      label: 'This Week',
      onClick: () => {
        setSelectedRange('This Week');
        handleThisWeekClick();
      },
    },
    last_week: {
      label: 'Last Week',
      onClick: () => {
        setSelectedRange('Last Week');
        handleLastWeekClick();
      },
    },
    this_month: {
      label: 'This Month',
      onClick: () => {
        setSelectedRange('This Month');
        handleThisMonthClick();
      },
    },
    last_month: {
      label: 'Last Month',
      onClick: () => {
        setSelectedRange('Last Month');
        handleLastMonthClick();
      },
    },
    year_to_date: {
      label: 'Year to Date',
      onClick: () => {
        setSelectedRange('Year to Date');
        handleYearToDateClick();
      },
    },
    last_year: {
      label: 'Last Year',
      onClick: () => {
        setSelectedRange('Last Year');
        handleLastYearClick();
      },
    },
  };

  useEffect(() => {
    handleThisMonthClick();
  }, []);
  return (
    <Dropdown>
      <Dropdown.Toggle as={Button} size="sm" variant="outline-primary">
        <Filter /> {selectedRange}
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-end">
        {Object.keys(options).map(o => (
          <Dropdown.Item key={o} onClick={options[o].onClick}>
            {options[o].label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
