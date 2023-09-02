/* eslint-disable max-lines-per-function */
/* eslint-disable no-console */
import Main from '@components/layout/main/main';
import Navigo from 'navigo';
import PageLogin from '@pages/login/login';
import PageReg from '@pages/registration/registration';
import PageHome from '@pages/home/home';
import Page404 from '@pages/page404/page404';
import UserProfile from '@pages/userProfile/userProfile';
import Store from '@app/store/store';
import UserAccount from '@pages/userProfile/userAccount/userAccount';
import CatalogPage from '@pages/catalog/catalog';
import { ProductCategory } from '@shared/enums';
import ProductListService from '@shared/api/product/product-list.service';
import DetailedProductPage from '@pages/detailed-product/detailed-product';
import { isHttpErrorType } from '@shared/utils/type-guards';
import { Route } from './routes';

const router = new Navigo('/');

const beforeHook = (done: (p?: boolean) => void): void => {
  if (Store.getState().customer) {
    done(false);
    router.navigate(Route.Home);
  } else {
    done();
  }
};

const initRouter = (): void => {
  router
    .on(() => Main.setProps({ page: new PageHome() }))
    .on({
      [Route.Home]: () => Main.setProps({ page: new PageHome() }),
      [Route.Login]: {
        as: 'login-page',
        uses: () => Main.setProps({ page: new PageLogin() }),
        hooks: {
          before: beforeHook,
        },
      },
      [Route.Registration]: {
        as: 'reg-page',
        uses: () => Main.setProps({ page: new PageReg() }),
        hooks: {
          before: beforeHook,
        },
      },
      [Route.Headphones]: {
        as: 'headphones-catalog',
        uses: () => Main.setProps({ page: new CatalogPage({ category: ProductCategory.Headphones }) }),
      },
      [Route.Earphones]: {
        as: 'earphones-catalog',
        uses: () => Main.setProps({ page: new CatalogPage({ category: ProductCategory.Earphones }) }),
      },
      [Route.Speakers]: {
        as: 'speakers-catalog',
        uses: () => Main.setProps({ page: new CatalogPage({ category: ProductCategory.Speakers }) }),
      },
      [Route.UserProfile]: {
        as: 'user-profile',
        uses: () => Main.setProps({ page: new UserProfile() }),
      },
      [Route.UserAccount]: {
        as: 'user-profile/account',
        uses: () => Main.setProps({ page: new UserAccount() }),
      },
    })
    .on(/(?:earphones|headphones|speakers)\/(.+)/, async (match) => {
      if (match && match.data) {
        const slug = match.data[0];
        const result = await ProductListService.getProductBySlug(Store.apiRoot, slug);

        if (result && !isHttpErrorType(result)) {
          Main.setProps({ page: new DetailedProductPage({ productData: result }) });
        } else {
          Main.setProps({ page: new Page404() });
        }
      }
    })
    .notFound(() => Main.setProps({ page: new Page404() }))
    .resolve();
};

export { initRouter, router };
