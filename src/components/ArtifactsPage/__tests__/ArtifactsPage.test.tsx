import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { ArtifactsPage } from 'components/ArtifactsPage/ArtifactsPage';

jest.mock('services/artifactApi');
jest.mock('services/keycloakService');
jest.mock('services/uiLogger');

describe('display ArtifactsPage component', () => {
  let artifactsMock: any;

  async function loadMocks() {
    const artifactsRequestMock = await import('services/__mocks__/artifacts-mock.json');
    artifactsMock = artifactsRequestMock.content;
  }

  beforeEach(async () => {
    await loadMocks();
  });

  test('renders ArtifactsPage', () => {
    render(
      <MemoryRouter>
        <ArtifactsPage />
      </MemoryRouter>
    );
  });

  test('compare snapshot with previous record', async () => {
    let tree: any;
    await act(async () => {
      tree = render(
        <MemoryRouter>
          <ArtifactsPage />
        </MemoryRouter>
      );
    });
    expect(tree).toMatchSnapshot();
  });
});
