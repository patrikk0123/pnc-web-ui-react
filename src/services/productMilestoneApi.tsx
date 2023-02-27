import { AxiosRequestConfig } from 'axios';

import { ArtifactPage, ProductMilestone, ProductMilestoneCloseResultPage } from 'pnc-api-types-ts';

import { pncClient } from './pncClient';

interface IProductMilestoneApiData {
  id: string;
}

/**
 * Gets a specific Product Milestone.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 * @param requestConfig - Axios based request config
 */
export const getProductMilestone = ({ id }: IProductMilestoneApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ProductMilestone>(`/product-milestones/${id}`, requestConfig);
};

/**
 * Gets Delivered Artifacts for Product Milestone.
 *
 * @param serviceData - object containing:
 *  - id - Product Milestone ID
 * @param requestConfig - Axios based request config
 */
export const getProductMilestoneDeliveredArtifacts = (
  { id }: IProductMilestoneApiData,
  requestConfig: AxiosRequestConfig = {}
) => {
  return pncClient.getHttpClient().get<ArtifactPage>(`/product-milestones/${id}/delivered-artifacts`, requestConfig);
};

/**
 * Gets Product Milestone close results.
 *
 * @param requestConfig - Axios based request config
 */
export const getCloseResults = ({ id }: IProductMilestoneApiData, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get<ProductMilestoneCloseResultPage>(`/product-milestones/${id}/close-results`, requestConfig);
};
