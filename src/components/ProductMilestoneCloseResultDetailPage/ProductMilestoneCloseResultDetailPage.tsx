import { Text, TextContent, TextVariants, ToolbarItem } from '@patternfly/react-core';
import { useCallback, useEffect } from 'react';

import { ProductMilestoneCloseResult } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { productMilestoneCloseResultEntityAttributes } from 'common/productMilestoneCloseResultEntityAttributes';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { hasMilestoneCloseFinished, usePncWebSocketEffect } from 'hooks/usePncWebSocketEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { ProductMilestoneCloseStatusLabelMapper } from 'components/LabelMapper/ProductMilestoneCloseStatusLabelMapper';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { PushedBuildsList } from 'components/PushedBuildsList/PushedBuildsList';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';

import * as productMilestoneApi from 'services/productMilestoneApi';

import { generatePageTitle } from 'utils/titleHelper';

export const ProductMilestoneCloseResultDetailPage = () => {
  const { productMilestoneId, closeResultId } = useParamsRequired();

  const serviceContainerProdutMilestoneCloseResult = useServiceContainer(productMilestoneApi.getCloseResults);
  const serviceContainerProdutMilestoneCloseResultRunner = serviceContainerProdutMilestoneCloseResult.run;
  const serviceContainerProductMilestoneCloseResultSetter = serviceContainerProdutMilestoneCloseResult.setData;

  const closeResult: ProductMilestoneCloseResult | undefined = serviceContainerProdutMilestoneCloseResult.data?.content?.[0];

  useEffect(() => {
    serviceContainerProdutMilestoneCloseResultRunner({
      serviceData: { id: productMilestoneId },
      requestConfig: {
        params: {
          q: `id==${closeResultId}`,
        },
      },
    });
  }, [serviceContainerProdutMilestoneCloseResultRunner, productMilestoneId, closeResultId]);

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasMilestoneCloseFinished(wsData, { closeResultId })) {
          const closeResult: ProductMilestoneCloseResult = wsData.productMilestoneCloseResult;
          serviceContainerProductMilestoneCloseResultSetter((oldCloseResult) => ({
            ...oldCloseResult,
            content: [closeResult],
          }));
        }
      },
      [serviceContainerProductMilestoneCloseResultSetter, closeResultId]
    )
  );

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerProdutMilestoneCloseResult,
      firstLevelEntity: 'Product',
      nestedEntity: 'Close Result',
      entityName: `Close Result ${PageTitles.delimiterSymbol} ${closeResult?.milestone?.version} ${PageTitles.delimiterSymbol} <unknown>`,
    })
  );

  return (
    <ServiceContainerLoading {...serviceContainerProdutMilestoneCloseResult} title="Product Milestone Close Result details">
      <PageLayout title="Close Result">
        <ContentBox padding marginBottom isResponsive>
          <Attributes>
            <AttributesItem title={productMilestoneCloseResultEntityAttributes.id.title}>{closeResult?.id}</AttributesItem>
            <AttributesItem title={productMilestoneCloseResultEntityAttributes.status.title}>
              {closeResult && <ProductMilestoneCloseStatusLabelMapper status={closeResult.status} />}
            </AttributesItem>
            <AttributesItem title={productMilestoneCloseResultEntityAttributes.startingDate.title}>
              {closeResult?.startingDate && <DateTime date={closeResult.startingDate} />}
            </AttributesItem>
            <AttributesItem title={productMilestoneCloseResultEntityAttributes.endDate.title}>
              {closeResult?.endDate && <DateTime date={closeResult.endDate} />}
            </AttributesItem>
          </Attributes>
        </ContentBox>

        <Toolbar borderBottom>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Pushed Builds</Text>
            </TextContent>
          </ToolbarItem>
        </Toolbar>
        <PushedBuildsList pushedBuilds={closeResult?.buildPushResults} />

        {/* TODO: Log*/}
      </PageLayout>
    </ServiceContainerLoading>
  );
};
