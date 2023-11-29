import { AxiosRequestConfig } from 'axios';
import { Operation } from 'fast-json-patch';

import {
  Build,
  BuildConfigPage,
  BuildConfigRevisionPage,
  BuildConfiguration,
  BuildConfigurationRevision,
  BuildPage,
  GroupConfigPage,
} from 'pnc-api-types-ts';

import { extendRequestConfig } from 'utils/requestConfigHelper';

import { pncClient } from './pncClient';

interface IBuildConfigApiData {
  id: string;
}

export interface IBuildStartParams {
  id: string;
  temporaryBuild?: boolean;
  rebuildMode?: string;
  buildDependencies?: boolean;
  keepPodOnFailure?: boolean;
  alignmentPreference?: string;
}

/**
 * Gets all Build Configs.
 *
 * @param requestConfig - Axios based request config
 */
export const getBuildConfigs = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildConfigPage>('/build-configs', requestConfig);
};

/**
 * Gets all BuildConfigs with latest build.
 *
 * @param requestConfig - Axios based request config
 */
export const getBuildConfigsWithLatestBuild = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildConfigPage>('/build-configs/x-with-latest-build', requestConfig);
};

/**
 * Gets a specific Build Config.
 *
 * @param id - Build Config ID
 * @param requestConfig - Axios based request config
 */
export const getBuildConfig = ({ id }: IBuildConfigApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildConfiguration>(`/build-configs/${id}`, requestConfig);
};

/**
 * Gets Revisions of a Build Config.
 *
 * @param serviceData - object containing:
 *  - id - Build Config ID
 * @param requestConfig - Axios based request config
 */
export const getRevisions = ({ id }: IBuildConfigApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildConfigRevisionPage>(`/build-configs/${id}/revisions`, requestConfig);
};

/**
 * Gets specific audited revision of Build Config.
 *
 * @param serviceData - object containing:
 *  - buildConfigId - ID of the Build Config
 *  - buildConfigRev - Revision number of the Build Config
 * @param requestConfig - Axios based request config
 */
export const getRevision = (
  { buildConfigId, buildConfigRev }: { buildConfigId: string; buildConfigRev: number },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient
    .getHttpClient()
    .get<BuildConfigurationRevision>(`/build-configs/${buildConfigId}/revisions/${buildConfigRev}`, requestConfig);
};

/**
 * Gets Dependencies of a Build Config.
 *
 * @param serviceData - object containing:
 *  - id - Build Config ID
 * @param requestConfig - Axios based request config
 */
export const getDependencies = ({ id }: IBuildConfigApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildPage>(`/build-configs/${id}/dependencies`, requestConfig);
};

/**
 * Gets Dependendants of a Build Config.
 *
 * @param serviceData - object containing:
 *  - id - Build Config ID
 * @param requestConfig - Axios based request config
 */
export const getDependendants = ({ id }: IBuildConfigApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildPage>(`/build-configs/${id}/dependants`, requestConfig);
};

/**
 * Gets Group Configs of a Build Config.
 *
 * @param serviceData - object containing:
 *  - id - Build Config ID
 * @param requestConfig - Axios based request config
 */
export const getGroupConfigs = ({ id }: IBuildConfigApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<GroupConfigPage>(`/build-configs/${id}/group-configs`, requestConfig);
};

/**
 * Gets Builds of a Build Config.
 *
 * @param serviceData - object containing:
 *  - id - Build Config ID
 * @param requestConfig - Axios based request config
 */
export const getBuilds = ({ id }: IBuildConfigApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildPage>(`/build-configs/${id}/builds`, requestConfig);
};

/**
 * Triggers a Build of a specific Build Config.
 *
 * @param buildStartParams - Object containing parameters to start a Build
 * @param requestConfig - Axios based request config
 */
export const build = ({ buildStartParams }: { buildStartParams: IBuildStartParams }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post<Build>(
    `/build-configs/${buildStartParams.id}/build`,
    null,
    extendRequestConfig({
      originalConfig: requestConfig,
      newParams: buildStartParams,
    })
  );
};

/**
 * Creates a new Build Config.
 *
 * @param data - object containing new Build Config data
 * @param requestConfig - Axios based request config
 */
export const createBuildConfig = ({ data }: { data: Omit<BuildConfiguration, 'id'> }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post<BuildConfiguration>('/build-configs', data, requestConfig);
};

/**
 * Patches a Build Config.
 *
 * @param serviceData - object containing:
 *  - id - Build Config ID
 *  - patchData - array of changes in JSON-Patch format
 * @param requestConfig - Axios based request config
 */
export const patchBuildConfig = (
  { id, patchData }: { id: string; patchData: Operation[] },
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().patch<BuildConfiguration>(`/build-configs/${id}`, patchData, requestConfig);
};
