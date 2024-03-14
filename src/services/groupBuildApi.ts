import { AxiosRequestConfig } from 'axios';

import { BuildPage, BuildsGraph, GroupBuild, GroupBuildPage } from 'pnc-api-types-ts';

import { extendRequestConfig } from 'utils/requestConfigHelper';

import { pncClient } from './pncClient';

interface IGroupBuildApiData {
  id: string;
}

/**
 * Gets all Group Builds.
 *
 * @param requestConfig - Axios based request config
 */
export const getGroupBuilds = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<GroupBuildPage>('/group-builds', requestConfig);
};

/**
 * Gets Group Builds of a User.
 *
 * @param serviceData - object containing:
 *  - userId - User ID
 * @param requestConfig - Axios based request config
 */
export const getUserGroupBuilds = ({ userId }: { userId: string }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<GroupBuildPage>(
    '/group-builds',
    extendRequestConfig({
      originalConfig: requestConfig,
      newParams: {
        qItems: [
          {
            id: 'user.id',
            value: userId,
            operator: '==',
          },
        ],
      },
    })
  );
};

/**
 * Gets a specific Group Build.
 *
 * @param serviceData - object containing:
 *  - id - Group Build ID
 * @param requestConfig - Axios based request config
 */
export const getGroupBuild = ({ id }: IGroupBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<GroupBuild>(`/group-builds/${id}`, requestConfig);
};

/**
 * Gets the Builds contained in the Group Build.
 *
 * @param serviceData - object containing:
 *  - id - Group Build ID
 * @param requestConfig - Axios based request config
 */
export const getBuilds = ({ id }: IGroupBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildPage>(`/group-builds/${id}/builds`, requestConfig);
};

/**
 * Gets dependency graph for a group build.
 *
 * @param serviceData - object containing:
 *  - id - Group Build ID
 * @param requestConfig - Axios based request config
 */
export const getDependencyGraph = ({ id }: IGroupBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<BuildsGraph>(`/group-builds/${id}/dependency-graph`, requestConfig);
};

/**
 * Pushes all performed Build of the Group Build to Brew.
 *
 * @param serviceData - object containing:
 *  - id - Group Build ID
 * @param requestConfig - Axios based request config
 */
export const pushToBrew = ({ id, data }: { id: string; data: { tagPrefix: string } }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post<any>(`/group-builds/${id}/brew-push`, data, requestConfig);
};

/**
 * Cancels running Group Build.
 *
 * @param serviceData - object containing:
 *  - id - Group Build ID
 * @param requestConfig - Axios based request config
 */
export const cancelGroupBuild = ({ id }: IGroupBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post<undefined>(`/group-builds/${id}/cancel`, undefined, requestConfig);
};
