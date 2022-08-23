import { AboutModal, TextContent, TextList, TextListItem } from '@patternfly/react-core';

import pncLogoText from '../../pnc-logo-text.svg';
import { EmptyStateSymbol } from '../EmptyStates/EmptyStateSymbol';

export interface AboutModalPageProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AboutModalPage = (props: AboutModalPageProps) => {
  const pncRepositoryUrl = 'https://github.com/project-ncl/pnc';
  const pncWebUiRepositoryUrl = 'https://github.com/project-ncl/pnc-web-ui-react';

  return (
    <>
      <AboutModal
        isOpen={props.isOpen}
        onClose={props.onClose}
        trademark="Red Hat, Inc. © 2021"
        brandImageSrc={pncLogoText}
        brandImageAlt="PNC Logo"
      >
        <TextContent>
          <TextList component="dl">
            <TextListItem component="dt">
              <a href={pncRepositoryUrl} target="_blank" rel="noopener noreferrer">
                PNC System Version
              </a>
            </TextListItem>
            <TextListItem component="dd">todo</TextListItem>

            <TextListItem component="dt">
              <a href={pncWebUiRepositoryUrl} target="_blank" rel="noopener noreferrer">
                PNC Web UI Version (Revision)
              </a>
            </TextListItem>
            <TextListItem component="dd">
              {process.env.REACT_APP_VERSION || <EmptyStateSymbol title="Version" />} (
              {process.env.REACT_APP_GIT_SHORT_SHA || <EmptyStateSymbol title="Revision" />})
            </TextListItem>
          </TextList>
        </TextContent>
      </AboutModal>
    </>
  );
};
