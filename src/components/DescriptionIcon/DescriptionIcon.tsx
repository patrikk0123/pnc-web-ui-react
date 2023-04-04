import { Popover } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import styles from './DescriptionIcon.module.css';

interface IDescriptionAttribute {
  label: string;
  value: string;
}

export interface IDescription {
  textTop?: string;
  attributes?: IDescriptionAttribute[];
}

interface IDescriptionIconProps {
  description: IDescription | string;
}

/**
 * Icon with description displayed on hover event.
 *
 * Of description is string, tooltip is used, popover otherwise.
 *
 * @param description - Description to be displayed on icon hover
 */
export const DescriptionIcon = ({ description }: IDescriptionIconProps) => (
  <div className={styles['box-description']}>
    {typeof description === 'string' ? (
      <TooltipWrapper tooltip={description}>
        <span className={styles['description-icon']}>
          <InfoCircleIcon />
        </span>
      </TooltipWrapper>
    ) : (
      <Popover
        removeFindDomNode
        bodyContent={
          <div>
            {description.textTop}
            {description.attributes &&
              description.attributes.map((attribute: IDescriptionAttribute, index: number) => (
                <dl className={styles['description-attribute']} key={index}>
                  <dt>
                    <b>{attribute.label}</b>
                  </dt>
                  <dd>{attribute.value}</dd>
                </dl>
              ))}
          </div>
        }
        showClose={false}
        enableFlip={false}
        position="left-start"
      >
        <span className={styles['description-icon']}>
          <InfoCircleIcon />
        </span>
      </Popover>
    )}
  </div>
);