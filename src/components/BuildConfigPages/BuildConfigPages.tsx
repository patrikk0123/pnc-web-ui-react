import { useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { BuildConfiguration } from 'pnc-api-types-ts';

import { SINGLE_PAGE_REQUEST_CONFIG } from 'common/constants';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { IServiceContainerState, useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { BuildHistoryList } from 'components/BuildHistoryList/BuildHistoryList';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { PageTabs } from 'components/PageTabs/PageTabs';
import { PageTabsItem } from 'components/PageTabs/PageTabsItem';
import { PageTabsLabel } from 'components/PageTabs/PageTabsLabel';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as buildConfigApi from 'services/buildConfigApi';

import { generatePageTitle } from 'utils/titleHelper';

type ContextType = { serviceContainerBuildConfig: IServiceContainerState<BuildConfiguration> };

interface IBuildConfigPagesProps {
  componentIdBuildHistory?: string;
}

export const BuildConfigPages = ({ componentIdBuildHistory = 'bh1' }: IBuildConfigPagesProps) => {
  const { buildConfigId } = useParamsRequired();

  const serviceContainerBuildConfig = useServiceContainer(buildConfigApi.getBuildConfig);
  const serviceContainerBuildConfigRunner = serviceContainerBuildConfig.run;

  const serviceContainerBuilds = useServiceContainer(buildConfigApi.getBuilds);
  const serviceContainerBuildsRunner = serviceContainerBuilds.run;

  const serviceContainerDependencies = useServiceContainer(buildConfigApi.getDependencies);
  const serviceContainerDependenciesRunner = serviceContainerDependencies.run;

  const serviceContainerDependants = useServiceContainer(buildConfigApi.getDependants);
  const serviceContainerDependantsRunner = serviceContainerDependants.run;

  const serviceContainerGroupConfigs = useServiceContainer(buildConfigApi.getGroupConfigs);
  const serviceContainerGroupConfigsRunner = serviceContainerGroupConfigs.run;

  const serviceContainerRevisions = useServiceContainer(buildConfigApi.getRevisions);
  const serviceContainerRevisionsRunner = serviceContainerRevisions.run;

  useQueryParamsEffect(
    ({ requestConfig } = {}) => {
      serviceContainerBuildsRunner({ serviceData: { id: buildConfigId }, requestConfig });
    },
    { componentId: componentIdBuildHistory }
  );

  useEffect(() => {
    serviceContainerBuildConfigRunner({ serviceData: { id: buildConfigId } });
    serviceContainerDependenciesRunner({ serviceData: { id: buildConfigId }, requestConfig: SINGLE_PAGE_REQUEST_CONFIG });
    serviceContainerDependantsRunner({ serviceData: { id: buildConfigId }, requestConfig: SINGLE_PAGE_REQUEST_CONFIG });
    serviceContainerGroupConfigsRunner({ serviceData: { id: buildConfigId }, requestConfig: SINGLE_PAGE_REQUEST_CONFIG });
    serviceContainerRevisionsRunner({ serviceData: { id: buildConfigId }, requestConfig: SINGLE_PAGE_REQUEST_CONFIG });
  }, [
    serviceContainerBuildConfigRunner,
    serviceContainerDependenciesRunner,
    serviceContainerDependantsRunner,
    serviceContainerGroupConfigsRunner,
    serviceContainerRevisionsRunner,
    buildConfigId,
  ]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerBuildConfig,
      firstLevelEntity: 'Build Config',
    })
  );

  const pageTabs = (
    <PageTabs>
      <PageTabsItem url="details">Details</PageTabsItem>
      <PageTabsItem url="dependencies">
        Dependencies{' '}
        <PageTabsLabel serviceContainer={serviceContainerDependencies} title="Dependencies Count">
          {serviceContainerDependencies.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="dependants">
        Dependants{' '}
        <PageTabsLabel serviceContainer={serviceContainerDependants} title="Dependants Count">
          {serviceContainerDependants.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="group-configs">
        Group Configs{' '}
        <PageTabsLabel serviceContainer={serviceContainerGroupConfigs} title="Group Configs Count">
          {serviceContainerGroupConfigs.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="revisions">
        Revisions{' '}
        <PageTabsLabel serviceContainer={serviceContainerRevisions} title="Revisions Count">
          {serviceContainerRevisions.data?.totalHits}
        </PageTabsLabel>
      </PageTabsItem>
      <PageTabsItem url="build-metrics">Build Metrics</PageTabsItem>
    </PageTabs>
  );

  return (
    <ServiceContainerLoading {...serviceContainerBuildConfig} title="Build Config details">
      <PageLayout
        title={serviceContainerBuildConfig.data?.name}
        tabs={pageTabs}
        actions={
          <ProtectedComponent>
            <ActionButton link="edit">Edit Build Config</ActionButton>
          </ProtectedComponent>
        }
        sidebar={{
          title: 'Build History',
          content: (
            <BuildHistoryList
              serviceContainerBuilds={serviceContainerBuilds}
              variant="Build"
              componentId={componentIdBuildHistory}
            />
          ),
        }}
      >
        <Outlet context={{ serviceContainerBuildConfig }} />
      </PageLayout>
    </ServiceContainerLoading>
  );
};

export function useServiceContainerBuildConfig() {
  return useOutletContext<ContextType>();
}