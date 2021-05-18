import * as React from 'react';
import { useEffect, useState } from 'react';
import { Filter } from 'react-feather';
import { endOfDay, startOfISOWeek, startOfMonth, startOfYear, sub } from 'date-fns';
import styles from './DateSelectDropdown.module.scss';
import { Dropdown as Dropdown2 } from '../../../components/dropdown/Dropdown';

interface DateSelectDropdownProps {
  handleRangeSelect: (startDate: Date, endDate: Date) => void;
  className?: string;
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
    <Dropdown2
      className={props.className}
      label={
        <>
          <Filter />
          {options[selectedRange].label}
        </>
      }
    >
      <ul className={styles.submenu}>
        {Object.keys(options).map(o => (
          <li key={o} onClick={handleRangeChange(o)}>
            <span>{options[o].label}</span>
          </li>
        ))}
      </ul>
    </Dropdown2>
  );
};
