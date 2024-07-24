import { Grid, GridItem, Text, TextContent, TextVariants, ToolbarItem } from '@patternfly/react-core';
import { useCallback, useMemo } from 'react';

import { Build, GroupBuild } from 'pnc-api-types-ts';

import { buildEntityAttributes } from 'common/buildEntityAttributes';
import { groupBuildEntityAttributes } from 'common/groupBuildEntityAttributes';

import { useComponentQueryParams } from 'hooks/useComponentQueryParams';
import {
  hasBuildStarted,
  hasBuildStatusChanged,
  hasGroupBuildStarted,
  hasGroupBuildStatusChanged,
  usePncWebSocketEffect,
} from 'hooks/usePncWebSocketEffect';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { BuildsList } from 'components/BuildsList/BuildsList';
import { DashboardWidget } from 'components/DashboardWidget/DashboardWidget';
import { GroupBuildsList } from 'components/GroupBuildsList/GroupBuildsList';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { Toolbar } from 'components/Toolbar/Toolbar';

import * as buildApi from 'services/buildApi';
import * as groupBuildApi from 'services/groupBuildApi';
import { userService } from 'services/userService';
import * as webConfigService from 'services/webConfigService';

import { refreshPage } from 'utils/refreshHelper';
import { debounce } from 'utils/utils';

export const DashboardPage = () => {
  const webConfig = webConfigService.getWebConfig();
  const trafficLightsUrl = webConfig.grafana.trafficLightsUrl;
  const statusMapUrl = webConfig.grafana.statusMapUrl;

  useTitle('Dashboard');

  return (
    <PageLayout
      title="Dashboard"
      description={
        <>
          The dashboard page contains the status of relevant services and the list of the builds and group builds triggered by the
          current user.
        </>
      }
    >
      <Grid hasGutter>
        <GridItem lg={12} xl2={6}>
          <DashboardWidget title="Service Status" src={trafficLightsUrl}></DashboardWidget>
        </GridItem>
        <GridItem lg={12} xl2={6}>
          <DashboardWidget title="Service Status Timeline" src={statusMapUrl}></DashboardWidget>
        </GridItem>
        <ProtectedComponent hide>
          <GridItem lg={12} xl2={6}>
            <Toolbar borderBottom>
              <ToolbarItem>
                <TextContent>
                  <Text component={TextVariants.h2}>My Builds</Text>
                </TextContent>
              </ToolbarItem>
            </Toolbar>

            <MyBuildsList />
          </GridItem>
          <GridItem lg={12} xl2={6}>
            <Toolbar borderBottom>
              <ToolbarItem>
                <TextContent>
                  <Text component={TextVariants.h2}>My Group Builds</Text>
                </TextContent>
              </ToolbarItem>
            </Toolbar>

            <MyGroupBuildsList />
          </GridItem>
        </ProtectedComponent>
      </Grid>
    </PageLayout>
  );
};

const userBuildsListColumns = [
  buildEntityAttributes.status.id,
  buildEntityAttributes.id.id,
  buildEntityAttributes.name.id,
  buildEntityAttributes.buildConfigName.id,
  buildEntityAttributes.submitTime.id,
  buildEntityAttributes.startTime.id,
  buildEntityAttributes.endTime.id,
];

interface IMyBuildsListProps {
  componentId?: string;
}

const MyBuildsList = ({ componentId = 'b1' }: IMyBuildsListProps) => {
  const serviceContainerUserBuilds = useServiceContainer(buildApi.getUserBuilds);
  const serviceContainerUserBuildsRunner = serviceContainerUserBuilds.run;
  const serviceContainerUserBuildsSetter = serviceContainerUserBuilds.setData;

  const userId = userService.getUserId();

  const { componentQueryParamsObject: userBuildsQueryParamsObject } = useComponentQueryParams(componentId);

  const serviceContainerUserBuildsRunnerDebounced = useMemo(
    () => debounce(serviceContainerUserBuildsRunner),
    [serviceContainerUserBuildsRunner]
  );

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerUserBuildsRunner({ serviceData: { userId }, requestConfig }),
      [serviceContainerUserBuildsRunner, userId]
    ),
    {
      componentId,
    }
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasBuildStarted(wsData, { userId })) {
          serviceContainerUserBuildsRunnerDebounced({
            serviceData: { userId },
            requestConfig: { params: userBuildsQueryParamsObject },
          });
        } else if (hasBuildStatusChanged(wsData, { userId })) {
          const wsBuild: Build = wsData.build;
          serviceContainerUserBuildsSetter((previousBuildPage) => refreshPage(previousBuildPage!, wsBuild));
        }
      },
      [serviceContainerUserBuildsRunnerDebounced, serviceContainerUserBuildsSetter, userBuildsQueryParamsObject, userId]
    )
  );

  return (
    <BuildsList serviceContainerBuilds={serviceContainerUserBuilds} columns={userBuildsListColumns} componentId={componentId} />
  );
};

const userGroupBuildsListColumns = [
  groupBuildEntityAttributes.status.id,
  groupBuildEntityAttributes.temporaryBuild.id,
  groupBuildEntityAttributes.name.id,
  groupBuildEntityAttributes['groupConfig.name'].id,
  groupBuildEntityAttributes.startTime.id,
  groupBuildEntityAttributes.endTime.id,
];

interface IMyGroupBuildsListProps {
  componentId?: string;
}

const MyGroupBuildsList = ({ componentId = 'g1' }: IMyGroupBuildsListProps) => {
  const serviceContainerUserGroupBuilds = useServiceContainer(groupBuildApi.getUserGroupBuilds);
  const serviceContainerUserGroupBuildsRunner = serviceContainerUserGroupBuilds.run;
  const serviceContainerUserGroupBuildsSetter = serviceContainerUserGroupBuilds.setData;

  const userId = userService.getUserId();

  const { componentQueryParamsObject: userGroupBuildsQueryParamsObject } = useComponentQueryParams(componentId);

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerUserGroupBuildsRunner({ serviceData: { userId }, requestConfig }),
      [serviceContainerUserGroupBuildsRunner, userId]
    ),
    { componentId }
  );

  usePncWebSocketEffect(
    useCallback(
      (wsData: any) => {
        if (hasGroupBuildStarted(wsData, { userId })) {
          serviceContainerUserGroupBuildsRunner({
            serviceData: { userId },
            requestConfig: { params: userGroupBuildsQueryParamsObject },
          });
        } else if (hasGroupBuildStatusChanged(wsData, { userId })) {
          const wsGroupBuild: GroupBuild = wsData.groupBuild;
          serviceContainerUserGroupBuildsSetter((previousGroupBuildPage) => refreshPage(previousGroupBuildPage!, wsGroupBuild));
        }
      },
      [serviceContainerUserGroupBuildsRunner, serviceContainerUserGroupBuildsSetter, userGroupBuildsQueryParamsObject, userId]
    )
  );

  return (
    <GroupBuildsList
      serviceContainerGroupBuilds={serviceContainerUserGroupBuilds}
      columns={userGroupBuildsListColumns}
      componentId={componentId}
    />
  );
};
