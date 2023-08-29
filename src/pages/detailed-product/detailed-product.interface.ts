import { IProduct } from '@shared/interfaces/product.interface';

export interface IDetailedProductPageProps extends IProps {
  productData?: IProduct;
  productSlug?: string;
}
