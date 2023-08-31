import { ProductProjection } from '@commercetools/platform-sdk';

export interface IProdCollectionProps extends IProps {
  productsData?: ProductProjection[];
}
