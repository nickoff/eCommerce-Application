import { IProduct } from '@shared/interfaces/product.interface';

export interface IProductCardProps extends IProps {
  productData: IProduct;
  expanded?: boolean;
}
