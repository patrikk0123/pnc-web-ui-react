import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { DeliverableAnalyzerOperationPage } from 'pnc-api-types-ts';

import { getFilterOptions, getSortOptions } from 'common/entityAttributes';
import { productMilestoneDeliverablesAnalysisEntityAttributes } from 'common/productMilestoneDeliverablesAnalysisEntityAttributes';

import { IServiceContainerState } from 'hooks/useServiceContainer';
import { ISortOptions, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { Filtering } from 'components/Filtering/Filtering';
import { DeliverablesAnalysisProgressStatusLabelMapper } from 'components/LabelMapper/DeliverablesAnalysisProgressStatusLabelMapper';
import { DeliverablesAnalysisResultLabelMapper } from 'components/LabelMapper/DeliverablesAnalysisResultLabelMapper';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';
import { Username } from 'components/Username/Username';

interface IProductMilestoneDeliverablesAnalysisListProps {
  serviceContainerDeliverablesAnalysis: IServiceContainerState<DeliverableAnalyzerOperationPage>;
  componentId: string;
}

/**
 * Component displaying list of Deliverables Analysis.
 *
 * @param serviceContainerDeliverablesAnalysis - Service Container for Deliverables Analysis
 * @param componentId - Component ID
 */
export const ProductMilestoneDeliverablesAnalysisList = ({
  serviceContainerDeliverablesAnalysis,
  componentId,
}: IProductMilestoneDeliverablesAnalysisListProps) => {
  const sortOptions: ISortOptions = useMemo(
    () =>
      getSortOptions({
        entityAttributes: productMilestoneDeliverablesAnalysisEntityAttributes,
        defaultSorting: {
          attribute: productMilestoneDeliverablesAnalysisEntityAttributes.submitTime.id,
          direction: 'desc',
        },
      }),
    []
  );

  const { getSortParams } = useSorting(sortOptions, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering
            filterOptions={useMemo(
              () => getFilterOptions({ entityAttributes: productMilestoneDeliverablesAnalysisEntityAttributes }),
              []
            )}
            componentId={componentId}
          />
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerDeliverablesAnalysis} title="Deliverables Analysis">
          <TableComposable isStriped variant="compact">
            <Thead>
              <Tr>
                <Th width={20}>{productMilestoneDeliverablesAnalysisEntityAttributes.id.title}</Th>
                <Th width={20}>{productMilestoneDeliverablesAnalysisEntityAttributes.progressStatus.title}</Th>
                <Th width={20}>{productMilestoneDeliverablesAnalysisEntityAttributes.result.title}</Th>
                <Th width={20} sort={getSortParams(sortOptions.sortAttributes['submitTime'].id)}>
                  {productMilestoneDeliverablesAnalysisEntityAttributes.submitTime.title}
                </Th>
                <Th width={20} sort={getSortParams(sortOptions.sortAttributes['user.username'].id)}>
                  {productMilestoneDeliverablesAnalysisEntityAttributes['user.username'].title}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerDeliverablesAnalysis.data?.content?.map((operation, rowIndex) => (
                <Tr key={rowIndex}>
                  <Td>
                    {/* TODO: Make link absolute once Product data are available */}
                    <Link to={operation.id}>{operation.id}</Link>
                  </Td>
                  <Td>
                    {operation.progressStatus && (
                      <DeliverablesAnalysisProgressStatusLabelMapper progressStatus={operation.progressStatus} />
                    )}
                  </Td>
                  <Td>{operation.result && <DeliverablesAnalysisResultLabelMapper result={operation.result} />}</Td>
                  <Td>{operation.submitTime && <DateTime date={operation.submitTime} />}</Td>
                  <Td>{operation.user?.username && <Username text={operation.user.username} />}</Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination componentId={componentId} count={serviceContainerDeliverablesAnalysis.data?.totalHits} />
    </>
  );
};
