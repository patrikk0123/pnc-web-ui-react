import {
  Alert,
  AlertProps,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';

import { SCMRepository } from 'pnc-api-types-ts';

import { isBoolean } from 'utils/entityRecognition';

interface IScmRepositoryUrlAlertProps {
  variant: 'synced' | 'not-synced';
  alertLevel?: AlertProps['variant'];
  internalUrl?: SCMRepository['internalUrl'];
  externalUrl?: SCMRepository['externalUrl'];
  preBuildSyncEnabled?: SCMRepository['preBuildSyncEnabled'];
}

/**
 * SCM repository synchronization alert. Displays properties of SCM repository when it is synced.
 *
 * @param variant - Whether the SCM repository is synced
 * @param alertLevel - Alert level alters styling depending on the use-case - e.g. info or danger
 * @param internalUrl - SCM repository internalUrl property - use with 'synced' variant
 * @param externalUrl - SCM repository externalUrl property - use with 'synced' variant
 * @param preBuildSyncEnabled - SCM repository preBuildSyncEnabled property - use with 'synced' variant
 */
export const ScmRepositoryUrlAlert = ({
  variant,
  alertLevel = 'info',
  internalUrl,
  externalUrl,
  preBuildSyncEnabled,
}: IScmRepositoryUrlAlertProps) => {
  if (variant === 'not-synced') {
    return <Alert variant={alertLevel} isInline title="This repository is not synced yet." />;
  }

  return (
    <Alert variant={alertLevel} isInline title="This external repository is already synced.">
      <DescriptionList isCompact>
        <DescriptionListGroup>
          <DescriptionListTerm>Internal URL</DescriptionListTerm>
          <DescriptionListDescription>{internalUrl}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>External URL</DescriptionListTerm>
          <DescriptionListDescription>{externalUrl}</DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Pre-build sync</DescriptionListTerm>
          <DescriptionListDescription>
            {isBoolean(preBuildSyncEnabled) && (preBuildSyncEnabled ? 'enabled' : 'disabled')}
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </Alert>
  );
};
