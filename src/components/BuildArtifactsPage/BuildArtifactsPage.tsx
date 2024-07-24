import { Text, TextContent, ToolbarItem } from '@patternfly/react-core';
import { useCallback, useState } from 'react';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';

import { ArtifactEditQualityModal } from 'components/ArtifactEditQualityModal/ArtifactEditQualityModal';
import { ArtifactEditQualityModalButton } from 'components/ArtifactEditQualityModal/ArtifactEditQualityModalButton';
import { ArtifactsList } from 'components/ArtifactsList/ArtifactsList';
import { useServiceContainerBuild } from 'components/BuildPages/BuildPages';
import { Toolbar } from 'components/Toolbar/Toolbar';

import * as buildApi from 'services/buildApi';

interface IBuildArtifactsPageProps {
  componentId?: string;
}

export const BuildArtifactsPage = ({ componentId = 'a1' }: IBuildArtifactsPageProps) => {
  const { buildId } = useParamsRequired();

  const { serviceContainerBuild } = useServiceContainerBuild();

  const serviceContainerArtifacts = useServiceContainer(buildApi.getBuiltArtifacts);
  const serviceContainerArtifactsRunner = serviceContainerArtifacts.run;

  const [isEditQualitiesModalOpen, setIsEditQualitiesModalOpen] = useState<boolean>(false);

  const toggleEditQualitiesModal = () => setIsEditQualitiesModalOpen((isEditQualitiesModalOpen) => !isEditQualitiesModalOpen);

  useQueryParamsEffect(
    useCallback(
      ({ requestConfig } = {}) => serviceContainerArtifactsRunner({ serviceData: { id: buildId }, requestConfig }),
      [serviceContainerArtifactsRunner, buildId]
    ),
    { componentId }
  );

  return (
    <>
      <Toolbar>
        <ToolbarItem>
          <TextContent>
            <Text component="h2">Artifacts</Text>
          </TextContent>
        </ToolbarItem>
        <ToolbarItem>
          <ArtifactEditQualityModalButton
            toggleModal={toggleEditQualitiesModal}
            isBuildVariant
            buildArtifactsCount={serviceContainerArtifacts.data?.content?.length}
          />
        </ToolbarItem>
        <Text>
          This list contains artifacts produced by this Build. Each Artifact is represented by PNC Identifier. You can also change
          quality of all artifacts produced by the Build here.
        </Text>
      </Toolbar>

      <ArtifactsList {...{ serviceContainerArtifacts, componentId }} />

      {isEditQualitiesModalOpen && (
        <ArtifactEditQualityModal
          isModalOpen={isEditQualitiesModalOpen}
          toggleModal={toggleEditQualitiesModal}
          build={serviceContainerBuild.data!}
          variant="detail"
        />
      )}
    </>
  );
};
