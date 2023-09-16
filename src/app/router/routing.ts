/* eslint-disable max-lines-per-function */
/* eslint-disable no-console */
import Main from '@components/layout/main/main';
import Navigo, { Match } from 'navigo';
import PageLogin from '@pages/login/login';
import PageReg from '@pages/registration/registration';
import PageHome from '@pages/home/home';
import NotFoundPage from '@pages/not-found/not-found';
import Store from '@app/store/store';
import CatalogPage from '@pages/catalog/catalog';
import ProductSearchService from '@shared/api/product/product-search.service';
import ProductRepoService from '@shared/api/product/product-repo.service';
import DetailedProductPage from '@pages/detailed-product/detailed-product';
import { isHttpErrorType } from '@shared/utils/type-guards';
import { capitalize } from 'lodash';
import { LANG_CODE } from '@shared/constants/misc';
import { LocalizedString } from '@commercetools/platform-sdk';
import { SITE_TITLE } from '@shared/constants/seo';
import UserProfilePage from '@pages/user-profile/user-profile';
import AboutUs from '@pages/about-us/about-us';
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

const userProfileBeforeHook = (done: (p?: boolean) => void): void => {
  if (!Store.getState().customer) {
    done(false);
    router.navigate(Route.Login);
  } else {
    done();
  }
};

const getPageParam = (match: Match): number | undefined => {
  if (!(match.params && match.params.page)) {
    return undefined;
  }

  const page = parseInt(match.params.page, 10);

  return Number.isNaN(page) ? undefined : page;
};

const initRouter = (): void => {
  router
    .on(() => Main.setProps({ page: new PageHome() }))
    .on({
      [Route.Home]: () => Main.setProps({ page: new PageHome(), showBreadcrumps: false }),
      [Route.AboutUs]: () => Main.setProps({ page: new AboutUs(), showBreadcrumps: false }),
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
        uses: () => Main.setProps({ page: new UserProfilePage({ visibleContent: 'info' }), showBreadcrumps: false }),
        hooks: {
          before: userProfileBeforeHook,
        },
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
          Main.setProps({ page: new NotFoundPage() });
        }
      }
    })
    .on(/(earphones|headphones|speakers)/, async (match) => {
      if (match && match.data) {
        const productTypeKey = match.data[0];

        const page = getPageParam(match);

        const catalogData = await ProductSearchService.fetchProductsByProductType(productTypeKey, page);

        if (catalogData) {
          Main.setProps({
            page: new CatalogPage({
              catalogData,
              includeTypeFilter: false,
              pageTitle: `${capitalize(productTypeKey)} | ${SITE_TITLE}`,
            }),
            showBreadcrumps: true,
            breadcrumpsPath: [
              { link: '/', label: 'Home' },
              { link: `/${productTypeKey}`, label: `${capitalize(productTypeKey)}` },
            ],
          });
        } else {
          Main.setProps({ page: new NotFoundPage() });
        }
      }
    })
    .on('/:vendorSlug', async (match) => {
      if (match && match.data) {
        const { vendorSlug } = match.data;
        const page = getPageParam(match);

        const catalogData = await ProductSearchService.fetchProductsByCategory(vendorSlug, page);

        if (catalogData) {
          Main.setProps({
            page: new CatalogPage({
              catalogData,
              includeTypeFilter: true,
              pageTitle: `${catalogData.filters.vendors[0].name[LANG_CODE]} | ${SITE_TITLE}`,
            }),
            showBreadcrumps: true,
            breadcrumpsPath: [
              { link: '/', label: 'Home' },
              { link: `/${vendorSlug}`, label: `${capitalize(vendorSlug)}` },
            ],
          });
        } else {
          Main.setProps({ page: new NotFoundPage() });
        }
      }
    })
    .notFound(() => Main.setProps({ page: new NotFoundPage() }))
    .resolve();
};

export { initRouter, router };
