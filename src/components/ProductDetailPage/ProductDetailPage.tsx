import { Label, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useCallback, useEffect } from 'react';

import { breadcrumbData } from 'common/breadcrumbData';
import { productEntityAttributes } from 'common/productEntityAttributes';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProductVersionsList } from 'components/ProductVersionsList/ProductVersionsList';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productApi from 'services/productApi';

import { generatePageTitle } from 'utils/titleHelper';

interface IProductDetailPageProps {
  componentId?: string;
}

export const ProductDetailPage = ({ componentId = 'v1' }: IProductDetailPageProps) => {
  const { productId } = useParamsRequired();
  const serviceContainerProduct = useServiceContainer(productApi.getProduct);
  const serviceContainerProductRunner = serviceContainerProduct.run;

  const serviceContainerProductVersions = useServiceContainer(productApi.getProductVersions);
  const serviceContainerProductVersionsRunner = serviceContainerProductVersions.run;

  useEffect(() => {
    serviceContainerProductRunner({ serviceData: { id: productId } });
  }, [serviceContainerProductRunner, productId]);

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerProductVersionsRunner({ serviceData: { id: productId }, requestConfig }),
      [serviceContainerProductVersionsRunner, productId]
    ),
    {
      componentId,
      mandatoryQueryParams: { pagination: true, sorting: false },
    }
  );

  useTitle(generatePageTitle({ serviceContainer: serviceContainerProduct, firstLevelEntity: 'Product' }));

  return (
    <ServiceContainerLoading {...serviceContainerProduct} title="Product details">
      <PageLayout
        title={serviceContainerProduct.data?.name}
        description={serviceContainerProduct.data?.description}
        breadcrumbs={[{ entity: breadcrumbData.product.id, title: serviceContainerProduct.data?.name }]}
        actions={
          <ProtectedComponent>
            <ActionButton link="edit">Edit Product</ActionButton>
          </ProtectedComponent>
        }
      >
        <ContentBox padding marginBottom isResponsive>
          <Attributes>
            <AttributesItem title={productEntityAttributes.abbreviation.title}>
              {serviceContainerProduct.data?.abbreviation}
            </AttributesItem>
            <AttributesItem title={productEntityAttributes.productManagers.title}>
              {serviceContainerProduct.data?.productManagers}
            </AttributesItem>
            <AttributesItem title={productEntityAttributes.productPagesCode.title}>
              {serviceContainerProduct.data?.productPagesCode}
            </AttributesItem>
          </Attributes>
        </ContentBox>

        <Toolbar borderBottom>
          <ToolbarItem reservedWidth>
            <TextContent>
              <Text component={TextVariants.h2}>Product Versions</Text>
              <Text>
                Product Version represents one Product stream like <Label>6.3</Label> or <Label>7.4</Label>. Each Product can
                contain multiple Product Versions and each Product Version can contain multiple Product Milestones.
              </Text>
            </TextContent>
          </ToolbarItem>
          <ToolbarItem alignRight>
            <ProtectedComponent>
              <ActionButton link="versions/create">Create Version</ActionButton>
            </ProtectedComponent>
          </ToolbarItem>
        </Toolbar>

        <ProductVersionsList {...{ serviceContainerProductVersions, componentId }} />
      </PageLayout>
    </ServiceContainerLoading>
  );
};
