import { Button, Tooltip } from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';

import { ProductMilestone, ProductRelease } from 'pnc-api-types-ts';

import { productMilestoneEntityAttributes } from 'common/productMilestoneEntityAttributes';
import { productReleaseEntityAttributes } from 'common/productReleaseEntityAttributes';

import { EmptyStateSymbol } from 'components/EmptyStateSymbol/EmptyStateSymbol';

import { isProductMilestone, isProductRelease } from 'utils/entityRecognition';
import { createDateTime } from 'utils/utils';

import styles from './ProductMilestoneReleaseLabel.module.css';

interface IProductMilestoneReleaseProp {
  productMilestoneRelease: ProductMilestone | ProductRelease;
  isCurrent: boolean;
  link?: string;
}

/**
 * Show Product Milestone or Release label with specific text and toolips.
 *
 * @param productMilestoneRelease - ProductMilestone or ProductRelease component to be displayed
 * @param isCurrent - If the ProductMilestone is current one
 * @param link - Link to navigate to
 */
export const ProductMilestoneReleaseLabel = ({ productMilestoneRelease, isCurrent, link }: IProductMilestoneReleaseProp) => {
  const navigate = useNavigate();

  let tooltipContent;
  let buttonClassName;
  let labelType;
  if (isProductMilestone(productMilestoneRelease)) {
    const productMilestone = productMilestoneRelease as ProductMilestone;
    labelType = 'milestone';
    tooltipContent = (
      <div className={styles['tooltip-text']}>
        <strong>{productMilestoneEntityAttributes.startingDate.title}: </strong>
        {createDateTime({ date: productMilestone.startingDate! }).date || <EmptyStateSymbol />}
        <br />
        <strong>{productMilestoneEntityAttributes.plannedEndDate.title}: </strong>
        {createDateTime({ date: productMilestone.plannedEndDate! }).date || <EmptyStateSymbol />}
        <br />
        <strong>{productMilestoneEntityAttributes.endDate.title}: </strong>
        {createDateTime({ date: productMilestone.endDate! }).date || <EmptyStateSymbol />}
      </div>
    );
    buttonClassName = isCurrent ? `${styles['milestone-label']} ${styles['is-current']}` : `${styles['milestone-label']}`;
  } else if (isProductRelease(productMilestoneRelease)) {
    labelType = 'release';
    const productRelease = productMilestoneRelease as ProductRelease;
    tooltipContent = (
      <div className={styles['toolip-text']}>
        <strong>{productReleaseEntityAttributes.releaseDate.title}: </strong>
        {createDateTime({ date: productRelease.releaseDate! }).date || <EmptyStateSymbol />}
        <br />
        <strong>{productReleaseEntityAttributes.supportLevel.title}: </strong>
        {productRelease.supportLevel}
      </div>
    );
    buttonClassName = `${styles['release-label']}`;
  }
  return (
    <span className={styles.label}>
      <Tooltip removeFindDomNode content={tooltipContent} isContentLeftAligned={true} position="auto">
        <Button
          onClick={link ? () => navigate(link) : undefined}
          isSmall={true}
          className={buttonClassName}
          component={labelType === 'milestone' ? 'a' : 'span'}
        >
          {productMilestoneRelease.version}
        </Button>
      </Tooltip>
    </span>
  );
};
