import { AxiosRequestConfig } from 'axios';

export const PageTitles = {
  projects: 'Projects',
  projectDetail: 'Project Detail',
  projectCreate: 'Create Project',
  projectEdit: 'Update Project',
  products: 'Products',
  productVersions: 'Product Versions',
  productMilestones: 'Product Milestones',
  buildConfig: 'Build Configs',
  groupConfig: 'Group Configs',
  builds: 'Builds',
  groupBuilds: 'Group Builds',
  artifacts: 'Artifacts',
  repositories: 'SCM Repositories',
  administration: 'Administration',
  pageNotFound: 'Page Not Found',
  delimiterSymbol: '·',
};

// For getting total item count
export const SINGLE_PAGE_REQUEST_CONFIG: AxiosRequestConfig = { params: { pageSize: 1 } };
