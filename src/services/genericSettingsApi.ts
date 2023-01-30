import { AxiosRequestConfig } from 'axios';

import { pncClient } from './pncClient';

/**
 * Gets an announcement message.
 *
 * @param requestConfig - Axios based request config
 * @returns Announcement message
 */
export const getAnnouncementBanner = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get('/generic-setting/announcement-banner', requestConfig);
};

/**
 * Creates an announcement message.
 *
 * @param serviceData - object containing:
 *  - message - announcement message
 * @param requestConfig - Axios based request config
 * @returns Created announcement message
 */
export const setAnnouncementBanner = ({ message }: { message: string }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post('/generic-setting/announcement-banner', message, requestConfig);
};

/**
 * Gets PNC version.
 *
 * @param requestConfig - Axios based request config
 * @returns PNC version
 */
export const getPncVersion = (requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().get('/generic-setting/pnc-version', requestConfig);
};

/**
 * Sets PNC version.
 *
 * @param serviceData - object containing:
 *  - version - PNC version
 * @param requestConfig - Axios based request config
 * @returns Promise with no data
 */
export const setPncVersion = ({ version }: { version: string }, requestConfig: AxiosRequestConfig = {}) => {
  return pncClient.getHttpClient().post('/generic-setting/pnc-version', version, requestConfig);
};
