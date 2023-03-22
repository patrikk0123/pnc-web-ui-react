import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { ProductAttributes } from 'common/ProductAttributes';

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
  const { productId } = useParams();

  const serviceContainerProduct = useServiceContainer(productApi.getProduct);
  const serviceContainerProductRunner = serviceContainerProduct.run;

  const serviceContainerProductVersions = useServiceContainer(productApi.getProductVersions);
  const serviceContainerProductVersionsRunner = serviceContainerProductVersions.run;

  useEffect(() => {
    serviceContainerProductRunner({ serviceData: { id: productId } });
  }, [serviceContainerProductRunner, productId]);

  useQueryParamsEffect(
    ({ requestConfig } = {}) => serviceContainerProductVersionsRunner({ serviceData: { id: productId }, requestConfig }),
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
        actions={
          <ProtectedComponent>
            <ActionButton action={() => console.log('Not implemented yet!')}>Edit Product</ActionButton>
          </ProtectedComponent>
        }
      >
        <ContentBox padding marginBottom>
          <Attributes>
            <AttributesItem title={ProductAttributes.abbreviation.title}>
              {serviceContainerProduct.data?.abbreviation}
            </AttributesItem>
            <AttributesItem title={ProductAttributes.productManagers.title}>
              {serviceContainerProduct.data?.productManagers}
            </AttributesItem>
            <AttributesItem title={ProductAttributes.productPagesCode.title}>
              {serviceContainerProduct.data?.productPagesCode}
            </AttributesItem>
          </Attributes>
        </ContentBox>

        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>Product Versions</Text>
            </TextContent>
          </ToolbarItem>
          <ToolbarItem alignRight>
            <ProtectedComponent>
              <ActionButton action={() => console.log('Not implemented yet!')}>Create Version</ActionButton>
            </ProtectedComponent>
          </ToolbarItem>
        </Toolbar>
        <ContentBox borderTop>
          <ProductVersionsList {...{ serviceContainerProductVersions, componentId }} />
        </ContentBox>
      </PageLayout>
    </ServiceContainerLoading>
  );
};
