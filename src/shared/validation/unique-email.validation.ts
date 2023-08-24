import { debounce } from 'lodash';
import { ValidationError } from 'yup';
import CustomerRepoService from '@shared/api/customer/customer-repo.service';
import Store from '@app/store/store';

const { apiRoot } = Store.getState();

const DEBOUNCE_TIMEOUT = 500;

const debounced = debounce(async (value: string, resolve: (v: boolean) => void): Promise<void> => {
  const res = await CustomerRepoService.isEmailUnique(apiRoot, value);
  resolve(res);
}, DEBOUNCE_TIMEOUT);

const isEmailUniqueDebounced = (email: string): Promise<boolean | ValidationError> =>
  new Promise((resolve) => {
    debounced(email, resolve);
  });

export default isEmailUniqueDebounced;
