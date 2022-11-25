import { AxiosRequestConfig } from 'axios';

import { pncClient } from './pncClient';

interface IGroupBuildApiData {
  id: string;
}

/**
 * Gets dependency graph for a group build.
 * @param data - object containing ID of the Group Build
 * @param requestConfig - Axios based request config
 * @returns DependencyGraph
 */
export const getDependencyGraph = ({ id }: IGroupBuildApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get(`/group-builds/${id}/dependency-graph`, requestConfig);
};