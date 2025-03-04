import { Button } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

interface IAnalyzeDeliverablesModalButtonProps {
  toggleModal: () => void;
  variant: 'detail' | 'list';
}

export const AnalyzeDeliverablesModalButton = ({ toggleModal, variant }: IAnalyzeDeliverablesModalButtonProps) => (
  <ProtectedComponent>
    <Button
      variant={variant === 'list' ? 'plain' : 'tertiary'}
      onClick={toggleModal}
      className={css(variant === 'list' && 'black-color', 'dropdown-item-font-size', 'text-align-left')}
      isBlock
      size="sm"
    >
      Analyze Deliverables
    </Button>
  </ProtectedComponent>
);
