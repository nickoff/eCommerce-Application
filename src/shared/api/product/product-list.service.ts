import { type HttpErrorType } from '@commercetools/sdk-client-v2';
import { ApiRoot } from '@shared/types';
import { type ProductProjection, type Category } from '@commercetools/platform-sdk';
import { CategoryId } from '@shared/enums';
import extractHttpError from '../extract-http-error.decorator';

class ProductListService {
  @extractHttpError
  static async getProductsByCategory(
    apiRoot: ApiRoot,
    categoryId: CategoryId,
  ): Promise<ProductProjection[] | HttpErrorType> {
    const response = await apiRoot
      .productProjections()
      .search()
      .get({ queryArgs: { filter: `categories.id:"${categoryId}"` } })
      .execute();

    return response.body.results;
  }

  @extractHttpError
  static async getCategories(apiRoot: ApiRoot): Promise<Category[] | HttpErrorType> {
    const response = await apiRoot.categories().get().execute();
    return response.body.results;
  }
}

export default ProductListService;
