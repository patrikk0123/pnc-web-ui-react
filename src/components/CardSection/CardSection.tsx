import { Card, CardBody } from '@patternfly/react-core';
import { DataContainer } from '../../containers/DataContainer/DataContainer';

interface ICardSection {
  children?: React.ReactNode;
  dataContainer?: any;
  title?: string;
}

export const CardSection = ({ children, dataContainer, title }: React.PropsWithChildren<ICardSection>) => {
  const cardBody = (
    <Card>
      <CardBody>{children}</CardBody>
    </Card>
  );
  return (
    <>
      {dataContainer ? (
        <DataContainer {...dataContainer} title={title}>
          {cardBody}
        </DataContainer>
      ) : (
        <>{cardBody}</>
      )}
    </>
  );
};
