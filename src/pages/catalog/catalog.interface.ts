import { ProductCategory } from '@shared/enums';

export interface ICatalogProps extends IProps {
  category: ProductCategory;
}
