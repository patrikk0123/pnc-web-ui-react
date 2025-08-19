import { Content, ContentVariants } from '@patternfly/react-core';
import { useCallback } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { BuildConfigsList } from 'components/BuildConfigsList/BuildConfigsList';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

import * as productVersionApi from 'services/productVersionApi';

interface IProductVersionBuildConfigsPageProps {
  componentId?: string;
}

export const ProductVersionBuildConfigsPage = ({ componentId = 'b1' }: IProductVersionBuildConfigsPageProps) => {
  const { productVersionId } = useParamsRequired();

  const serviceContainerBuildConfigs = useServiceContainer(productVersionApi.getBuildConfigs);
  const serviceContainerBuildConfigsRunner = serviceContainerBuildConfigs.run;

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerBuildConfigsRunner({ serviceData: { id: productVersionId }, requestConfig }),
      [serviceContainerBuildConfigsRunner, productVersionId]
    ),
    { componentId }
  );

  return (
    <>
      <Toolbar borderBottom>
        <ToolbarItem reservedWidth>
          <Content component={ContentVariants.h2}>Build Configs</Content>
        </ToolbarItem>
        <ToolbarItem alignRight>
          <ProtectedComponent>
            <ActionButton link="edit">Edit list</ActionButton>
          </ProtectedComponent>
        </ToolbarItem>
      </Toolbar>

      <BuildConfigsList {...{ serviceContainerBuildConfigs, componentId }} />
    </>
  );
};
