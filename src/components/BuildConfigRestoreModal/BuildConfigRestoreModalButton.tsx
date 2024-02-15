import { Button } from '@patternfly/react-core';

import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

interface IBuildConfigRestoreModalButtonProps {
  toggleModal: () => void;
}

export const BuildConfigRestoreModalButton = ({ toggleModal }: IBuildConfigRestoreModalButtonProps) => (
  <ProtectedComponent>
    <Button variant="tertiary" onClick={toggleModal} isSmall>
      Restore
    </Button>
  </ProtectedComponent>
);
