import { SelectOption as SelectOptionPF, SelectOptionProps } from '@patternfly/react-core';

import { TSelectOption } from 'components/Select/Select';

interface ISelectOptionProps<T extends TSelectOption> {
  option: T;
  title?: SelectOptionProps['children'];
  description?: SelectOptionProps['description'];
  isDisabled?: SelectOptionProps['isDisabled'];
}

export const SelectOption = <T extends TSelectOption>({ option, title, ...restProps }: ISelectOptionProps<T>) => (
  <SelectOptionPF value={option} {...restProps}>
    {title || option.toString()}
  </SelectOptionPF>
);
