import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { ArtifactRevisionPage } from 'pnc-api-types-ts';

import { artifactQualityRevisionEntityAttributes } from 'common/artifactQualityRevisionEntityAttributes';
import { PageTitles } from 'common/constants';

import { IServiceContainerState } from 'hooks/useServiceContainer';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { ArtifactQualityLabelMapper } from 'components/LabelMapper/ArtifactQualityLabelMapper';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

interface IArtifactQualityRevisionsListProps {
  serviceContainerQualityRevisions: IServiceContainerState<ArtifactRevisionPage>;
  componentId: string;
}

/**
 * Component displaying list of Artifact Quality Revisions.
 *
 * @param serviceContainerQualityRevisions - Service Container for Artifact Quality Revisions
 * @param componentId - Component ID
 */
export const ArtifactQualityRevisionsList = ({
  serviceContainerQualityRevisions,
  componentId,
}: IArtifactQualityRevisionsListProps) => {
  return (
    <>
      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerQualityRevisions} title={PageTitles.artifactQualityRevisions}>
          <Table isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={20}>{artifactQualityRevisionEntityAttributes.modificationTime.title}</Th>
                <Th width={20}>{artifactQualityRevisionEntityAttributes['modificationUser.username'].title}</Th>
                <Th width={20}>{artifactQualityRevisionEntityAttributes.artifactQuality.title}</Th>
                <Th width={40}>{artifactQualityRevisionEntityAttributes.qualityLevelReason.title}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerQualityRevisions.data?.content?.map((artifactRevision, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>{artifactRevision.modificationTime && <DateTime date={artifactRevision.modificationTime} />}</Td>
                  <Td>{artifactRevision.modificationUser?.username}</Td>
                  <Td>
                    {artifactRevision.artifactQuality && (
                      <ArtifactQualityLabelMapper quality={artifactRevision.artifactQuality} />
                    )}
                  </Td>
                  <Td>{artifactRevision.qualityLevelReason}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerQualityRevisions.data?.totalHits} />
    </>
  );
};
