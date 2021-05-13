import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { Filter } from 'react-feather';

import { endOfDay, startOfISOWeek, startOfMonth, startOfYear, sub } from 'date-fns';

interface DateSelectDropdownProps {
  handleRangeSelect: (startDate: Date, endDate: Date) => void;
}

export const DateSelectDropdown = (props: DateSelectDropdownProps) => {
  const [selectedRange, setSelectedRange] = useState('this_month');
  const options = {
    today: {
      label: 'Today',
    },
    this_week: {
      label: 'This Week',
    },
    last_week: {
      label: 'Last Week',
    },
    this_month: {
      label: 'This Month',
    },
    last_month: {
      label: 'Last Month',
    },
    year_to_date: {
      label: 'Year to Date',
    },
    last_year: {
      label: 'Last Year',
    },
  };
  const handleRangeChange = (id: string) => () => {
    setSelectedRange(id);
    switch (id) {
      case 'today': {
        const endDate = endOfDay(new Date());
        props.handleRangeSelect(sub(endDate, { days: 1 }), endDate);
        break;
      }
      case 'this_week': {
        const endDate = endOfDay(new Date());
        props.handleRangeSelect(sub(endDate, { weeks: 1 }), endDate);
        break;
      }
      case 'last_week': {
        const endDate = startOfISOWeek(new Date());
        props.handleRangeSelect(sub(endDate, { weeks: 1 }), endDate);
        break;
      }
      case 'this_month': {
        const endDate = endOfDay(new Date());
        props.handleRangeSelect(sub(endDate, { months: 1 }), endDate);
        break;
      }
      case 'last_month': {
        const endDate = startOfMonth(new Date());
        props.handleRangeSelect(sub(endDate, { weeks: 1 }), endDate);
        break;
      }
      case 'year_to_date': {
        const endDate = endOfDay(new Date());
        props.handleRangeSelect(sub(endDate, { years: 1 }), endDate);
        break;
      }
      case 'last_year': {
        const endDate = startOfYear(new Date());
        props.handleRangeSelect(sub(endDate, { years: 1 }), endDate);
        break;
      }
    }
  };
  useEffect(() => {
    handleRangeChange('this_month')();
  }, []);
  return (
    <Dropdown>
      <Dropdown.Toggle as={Button} size="sm" variant="outline-primary">
        <Filter /> {options[selectedRange].label}
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-end">
        {Object.keys(options).map(o => (
          <Dropdown.Item key={o} onClick={handleRangeChange(o)}>
            {options[o].label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
