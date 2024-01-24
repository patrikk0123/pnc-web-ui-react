import { TextInput, TextInputProps } from '@patternfly/react-core';
import { useEffect, useRef } from 'react';

import { ServiceContainerRunnerFunction, TServiceData, areServiceDataPaginated } from 'hooks/useServiceContainer';

interface ITextInputFindMatchProps<T extends TServiceData> extends TextInputProps {
  validator?: (value: string) => boolean;
  fetchCallback: (serviceData: string) => ReturnType<ServiceContainerRunnerFunction<T, any>>;
  onMatch: (data: T) => void;
  onNoMatch: () => void;
  delayMilliseconds?: number;
  onChange: (value: string) => void;
}

/**
 * Text input component trying to find matching entity.
 * Validating function can be passed to try to match only when entity string is valid.
 *
 * @param validator - function validating text input
 * @param fetchCallback - function to fetch the data with
 * @param onMatch - callback called when match was found
 * @param onNoMatch - callback called when no match was found
 * @param delayMilliseconds - fetch delay for text input change
 */
export const TextInputFindMatch = <T extends TServiceData>({
  validator,
  fetchCallback,
  onMatch,
  onNoMatch,
  delayMilliseconds = 200,
  onChange,
  ...rest
}: ITextInputFindMatchProps<T>) => {
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      clearTimeout(timeout?.current);
    };
  }, []);

  return (
    <TextInput
      onChange={(value) => {
        onChange(value);

        clearTimeout(timeout?.current);
        timeout.current = setTimeout(() => {
          if (!validator || validator(value)) {
            fetchCallback(value)
              .then((response) => {
                const data = response.data;

                if (data && (!areServiceDataPaginated(data) || data.content?.length)) {
                  onMatch(data);
                } else {
                  onNoMatch();
                }
              })
              .catch(() => {
                onNoMatch();
              });
          } else {
            onNoMatch();
          }
        }, delayMilliseconds);
      }}
      {...rest}
    />
  );
};
