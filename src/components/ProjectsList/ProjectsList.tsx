import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Link } from 'react-router-dom';

import { Project } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { getFilterAttributes } from 'common/entityAttributes';
import { projectEntityAttributes } from 'common/projectEntityAttributes';

import { IServiceContainer } from 'hooks/useServiceContainer';
import { ISortAttributes, useSorting } from 'hooks/useSorting';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Filtering } from 'components/Filtering/Filtering';
import { Pagination } from 'components/Pagination/Pagination';
import { ProjectLink } from 'components/ProjectLink/ProjectLink';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

const sortAttributes: ISortAttributes = {
  name: {
    id: 'name',
    title: 'Name',
    tableColumnIndex: 0,
  },
  description: {
    id: 'description',
    title: 'Description',
    tableColumnIndex: 1,
  },
};

interface IProjectsList {
  serviceContainerProjects: IServiceContainer;
  componentId: string;
}

/**
 * Component displaying list of Projects.
 *
 * @param serviceContainerProjects - Service Container for Projects
 * @param componentId - Component ID
 */
export const ProjectsList = ({ serviceContainerProjects, componentId }: IProjectsList) => {
  const { getSortParams } = useSorting(sortAttributes, componentId);

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <Filtering filterOptions={getFilterAttributes(projectEntityAttributes)} componentId={componentId} />{' '}
        </ToolbarItem>
      </Toolbar>

      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerProjects} title={PageTitles.projects}>
          <TableComposable isStriped variant="compact">
            <Thead>
              {/**
               * If column order is changed, the property tableColumnIndex (see sortAttributes) has to be updated.
               * Better solution can be implemented in the future.
               */}
              <Tr>
                <Th width={30} sort={getSortParams(sortAttributes['name'].id)}>
                  Name
                </Th>
                <Th sort={getSortParams(sortAttributes['description'].id)}>Description</Th>
                <Th width={15}>Build Configs count</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {serviceContainerProjects.data?.content.map((project: Project, rowIndex: number) => (
                <Tr key={rowIndex}>
                  <Td>{<ProjectLink id={project.id}>{project.name}</ProjectLink>}</Td>
                  <Td>{project.description}</Td>
                  <Td>{Object.keys(project.buildConfigs || []).length}</Td>
                  <Td>
                    <ProtectedComponent>
                      <Link to={`${project.id}/edit`}>edit</Link>
                    </ProtectedComponent>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      {/* Pagination need to be outside of ServiceContainerLoading so that it can initialize Query Params */}
      <Pagination componentId={componentId} count={serviceContainerProjects.data?.totalHits} />
    </>
  );
};
