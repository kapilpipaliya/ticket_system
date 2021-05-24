import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Filter } from 'react-feather';
import { endOfDay, startOfISOWeek, startOfMonth, startOfYear, sub } from 'date-fns';
import styles from './DateSelectDropdown.module.scss';
import { Select } from 'react-functional-select';

interface DateSelectDropdownProps {
  handleRangeSelect: (startDate: Date, endDate: Date) => void;
  className?: string;
  isDisabled: boolean;
}

type Option = Readonly<{
  id: string;
  label: string;
}>;

type SingleSelectDemoProps = Readonly<{}>;

const _cityOptions: Option[] = [
  { id: 'today', label: 'Today' },
  { id: 'this_week', label: 'This Week' },
  { id: 'last_week', label: 'Last Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'year_to_date', label: 'Year to Date' },
  { id: 'last_year', label: 'Last Year' },
];

export const DateSelectDropdown = (props: DateSelectDropdownProps) => {
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(_cityOptions[3]);

  const getOptionValue = useCallback((option: Option): string => option.id, []);
  const onOptionChange = useCallback((option: Option | null): void => setSelectedOption(option), []);
  const getOptionLabel = useCallback((option: Option): string => `${option.label}`, []);

  useEffect(() => {
    switch (selectedOption.id) {
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
  }, [selectedOption]);

  useEffect(() => {
    props.isDisabled && setIsInvalid(false);
  }, [props.isDisabled]);

  return (
    <div className={props.className}>
      <Select
        isClearable
        isInvalid={isInvalid}
        options={_cityOptions}
        isDisabled={props.isDisabled}
        onOptionChange={onOptionChange}
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        initialValue={selectedOption}
      />
    </div>
  );
};
