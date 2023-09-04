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
import CatalogPage from '@pages/catalog/catalog';
import ProductSearchService from '@shared/api/product/product-search.service';
import ProductRepoService from '@shared/api/product/product-repo.service';
import DetailedProductPage from '@pages/detailed-product/detailed-product';
import { isHttpErrorType } from '@shared/utils/type-guards';
import { capitalize } from 'lodash';
import { LANG_CODE } from '@shared/constants/misc';
import { LocalizedString } from '@commercetools/platform-sdk';
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
      [Route.Home]: () => Main.setProps({ page: new PageHome(), showBreadcrumps: false }),
      [Route.Login]: {
        as: 'login-page',
        uses: () => Main.setProps({ page: new PageLogin(), showBreadcrumps: false }),
        hooks: {
          before: beforeHook,
        },
      },
      [Route.Registration]: {
        as: 'reg-page',
        uses: () => Main.setProps({ page: new PageReg(), showBreadcrumps: false }),
        hooks: {
          before: beforeHook,
        },
      },
      [Route.UserProfile]: {
        as: 'user-profile',
        uses: () => Main.setProps({ page: new UserProfile() }),
      },
    })
    .on(/(earphones|headphones|speakers)\/(.+)/, async (match) => {
      if (match && match.data) {
        const type = match.data[0];
        const slug = match.data[1];
        const result = await ProductRepoService.getProductBySlug(slug);
        const prodName = (result.name as LocalizedString)[LANG_CODE];

        if (result && !isHttpErrorType(result)) {
          Main.setProps({
            page: new DetailedProductPage({ productData: result }),
            showBreadcrumps: true,
            breadcrumpsPath: [
              { link: '/', label: 'Home' },
              { link: `/${type}`, label: `${capitalize(type)}` },
              { link: `/${type}/${slug}`, label: `${prodName}` },
            ],
          });
        } else {
          Main.setProps({ page: new Page404() });
        }
      }
    })
    .on(/(earphones|headphones|speakers)/, async (match) => {
      if (match && match.data) {
        const productTypeKey = match.data[0];

        const catalogData = await ProductSearchService.fetchProductsByProductType(productTypeKey);

        if (catalogData) {
          Main.setProps({
            page: new CatalogPage({ catalogData, includeTypeFilter: false }),
            showBreadcrumps: true,
            breadcrumpsPath: [
              { link: '/', label: 'Home' },
              { link: `/${productTypeKey}`, label: `${capitalize(productTypeKey)}` },
            ],
          });
        } else {
          Main.setProps({ page: new Page404() });
        }
      }
    })
    .on('/:vendorSlug', async (match) => {
      if (match && match.data) {
        const { vendorSlug } = match.data;

        const catalogData = await ProductSearchService.fetchProductsByCategory(vendorSlug);

        if (catalogData) {
          Main.setProps({
            page: new CatalogPage({ catalogData, includeTypeFilter: true }),
            showBreadcrumps: true,
            breadcrumpsPath: [
              { link: '/', label: 'Home' },
              { link: `/${vendorSlug}`, label: `${capitalize(vendorSlug)}` },
            ],
          });
        } else {
          Main.setProps({ page: new Page404() });
        }
      }
    })
    .notFound(() => Main.setProps({ page: new Page404() }))
    .resolve();
};

export { initRouter, router };
