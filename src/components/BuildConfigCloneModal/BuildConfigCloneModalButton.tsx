import { BuildConfiguration } from 'common/pnc-api-types-ts';

import { ProtectedButton } from 'components/Button/Button';

import { SERVICE_BUILD_CATEGORY } from 'utils/features';

interface IBuildConfigCloneModalButtonProps {
  toggleModal: () => void;
  variant: 'detail' | 'list';
  buildConfig?: BuildConfiguration;
}

export const BuildConfigCloneModalButton = ({ toggleModal, variant, buildConfig }: IBuildConfigCloneModalButtonProps) => {
  const isServiceBuildCategoryDisabled =
    buildConfig?.parameters?.BUILD_CATEGORY === 'SERVICE' && !SERVICE_BUILD_CATEGORY.isEnabled;

  return (
    <ProtectedButton
      variant={variant === 'list' ? 'plain' : 'secondary'}
      onClick={toggleModal}
      size="sm"
      isDisabled={isServiceBuildCategoryDisabled}
      tooltip={isServiceBuildCategoryDisabled ? SERVICE_BUILD_CATEGORY.disabledReason : undefined}
    >
      Clone
    </ProtectedButton>
  );
};
