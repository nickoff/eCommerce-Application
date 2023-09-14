import { ApiRoot } from '@shared/types';
import { type HttpErrorType } from '@commercetools/sdk-client-v2';
import { Cart, CartDraft } from '@commercetools/platform-sdk';
import extractHttpError from '../extract-http-error.decorator';

class CartRepoService {
  @extractHttpError
  static async createMeCart(apiRoot: ApiRoot, cartDraft: CartDraft): Promise<Cart | HttpErrorType> {
    return apiRoot
      .me()
      .carts()
      .post({
        body: cartDraft,
      })
      .execute()
      .then(({ body }) => body);
  }

  @extractHttpError
  static async getCartById(apiRoot: ApiRoot, ID: string): Promise<Cart | HttpErrorType> {
    return apiRoot
      .carts()
      .withId({ ID })
      .get()
      .execute()
      .then(({ body }) => body);
  }

  @extractHttpError
  static async getCartByCustomerId(apiRoot: ApiRoot, customerId: string): Promise<Cart | HttpErrorType> {
    return apiRoot
      .carts()
      .withCustomerId({ customerId })
      .get()
      .execute()
      .then(({ body }) => body);
  }

  @extractHttpError
  static async getMyActiveCart(apiRoot: ApiRoot): Promise<Cart | HttpErrorType> {
    return apiRoot
      .me()
      .activeCart()
      .get()
      .execute()
      .then(({ body }) => body);
  }

  @extractHttpError
  static async addLineItemToCart(
    apiRoot: ApiRoot,
    productId: string,
    versionCart: number,
    cartId: string,
  ): Promise<Cart | HttpErrorType> {
    return apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: versionCart,
          actions: [
            {
              action: 'addLineItem',
              productId,
            },
          ],
        },
      })
      .execute()
      .then(({ body }) => body);
  }
}

export default CartRepoService;
