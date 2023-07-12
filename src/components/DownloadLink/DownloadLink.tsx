import { Flex, FlexItem, FlexProps } from '@patternfly/react-core';
import { DownloadIcon } from '@patternfly/react-icons';

interface IDownloadLinkProps {
  url: string;
  title: string;
  showIcon?: boolean;
}

const spaceItemsSm: FlexProps['spaceItems'] = { default: 'spaceItemsSm' };

export const DownloadLink = ({ url, title, showIcon = true }: IDownloadLinkProps) => {
  return (
    <Flex spaceItems={spaceItemsSm}>
      {showIcon && (
        <FlexItem>
          <a href={url} target="_self">
            <DownloadIcon />
          </a>
        </FlexItem>
      )}
      <FlexItem>
        <a href={url} target="_self">
          {title}
        </a>
      </FlexItem>
    </Flex>
  );
};
