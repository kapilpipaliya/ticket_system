import * as React from 'react';
import { useEffect, useState } from 'react';
import { endOfDay, startOfISOWeek, startOfMonth, startOfYear, sub } from 'date-fns';
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

const dateRangeOptions: Option[] = [
  { id: 'today', label: 'Today' },
  { id: 'this_week', label: 'This Week' },
  { id: 'last_week', label: 'Last Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'year_to_date', label: 'Year to Date' },
  { id: 'last_year', label: 'Last Year' },
];

export const DateSelectDropdown = (props: DateSelectDropdownProps) => {
  const { handleRangeSelect, isDisabled, className } = props;
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(dateRangeOptions[3]);

  const getOptionValue = (option: Option): string => option.id;
  const onOptionChange = (option: Option | null): void => setSelectedOption(option);
  const getOptionLabel = (option: Option): string => `${option.label}`;

  useEffect(() => {
    switch (selectedOption.id) {
      case 'today': {
        const endDate = endOfDay(new Date());
        handleRangeSelect(sub(endDate, { days: 1 }), endDate);
        break;
      }
      case 'this_week': {
        const endDate = endOfDay(new Date());
        handleRangeSelect(sub(endDate, { weeks: 1 }), endDate);
        break;
      }
      case 'last_week': {
        const endDate = startOfISOWeek(new Date());
        handleRangeSelect(sub(endDate, { weeks: 1 }), endDate);
        break;
      }
      case 'this_month': {
        const endDate = endOfDay(new Date());
        handleRangeSelect(sub(endDate, { months: 1 }), endDate);
        break;
      }
      case 'last_month': {
        const endDate = startOfMonth(new Date());
        handleRangeSelect(sub(endDate, { weeks: 1 }), endDate);
        break;
      }
      case 'year_to_date': {
        const endDate = endOfDay(new Date());
        handleRangeSelect(sub(endDate, { years: 1 }), endDate);
        break;
      }
      case 'last_year': {
        const endDate = startOfYear(new Date());
        handleRangeSelect(sub(endDate, { years: 1 }), endDate);
        break;
      }
    }
  }, [selectedOption]);

  useEffect(() => {
    isDisabled && setIsInvalid(false);
  }, [isDisabled]);

  return (
    <div className={className}>
      <Select
        isClearable
        isInvalid={isInvalid}
        options={dateRangeOptions}
        isDisabled={isDisabled}
        onOptionChange={onOptionChange}
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        initialValue={selectedOption}
      />
    </div>
  );
};
