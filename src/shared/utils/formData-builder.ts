import { Input } from '@components/shared/ui/input/input';
import Select from '@components/shared/ui/select/select';
import { IAddress, INewCustomer } from '@shared/interfaces/customer.interface';

type ObjectData = Record<string, string | number | boolean | Date | string[]>;

function formRegValidator(form: HTMLFormElement): boolean {
  let hasErrors = false;
  const arrInput = Array.from(form.elements).filter(
    (el) => el instanceof HTMLInputElement || el instanceof HTMLSelectElement,
  );
  arrInput.forEach((el) => {
    if (el instanceof HTMLInputElement && el.type === 'checkbox') return;
    if (el instanceof HTMLSelectElement && el.disabled !== true) {
      if (!(el.parentElement?.getComponent() as Select).toggleRequiredError()) {
        hasErrors = true;
      }
    }
    if (el instanceof HTMLInputElement && el.disabled !== true) {
      const instanceInput = el.parentElement?.getComponent() as Input;
      if (instanceInput && !instanceInput.noValidationRequired) {
        if (!instanceInput.validation()) {
          hasErrors = true;
        }
      }
    }
  });
  return hasErrors;
}

function getShippingAddress(data: ObjectData): IAddress {
  return {
    country: Array.isArray(data.country) ? data.country[0] : (data.country as string),
    city: Array.isArray(data.city) ? data.city[0] : (data.city as string),
    street: Array.isArray(data.streetName) ? data.streetName[0] : (data.streetName as string),
    postalCode: Array.isArray(data.postalCode) ? data.postalCode[0] : (data.postalCode as string),
  };
}

function getBillingAddress(data: ObjectData): IAddress {
  return {
    country: Array.isArray(data.country) ? data.country[1] : (data.country as string),
    city: Array.isArray(data.city) ? data.city[1] : (data.city as string),
    street: Array.isArray(data.streetName) ? data.streetName[1] : (data.streetName as string),
    postalCode: Array.isArray(data.postalCode) ? data.postalCode[1] : (data.postalCode as string),
  };
}

export function formDataBuilder(form: HTMLFormElement): INewCustomer {
  const dataDraft: ObjectData = {};
  if (!formRegValidator(form)) {
    const arrInput = Array.from(form.elements).filter(
      (el) => el instanceof HTMLInputElement || el instanceof HTMLSelectElement,
    );

    arrInput.forEach((value) => {
      const inputValue = value as HTMLInputElement;
      if (dataDraft[inputValue.name]) {
        if (Array.isArray(dataDraft[inputValue.name])) {
          (dataDraft[inputValue.name] as string[]).push(inputValue.value);
        } else {
          dataDraft[inputValue.name] = [dataDraft[inputValue.name] as string, inputValue.value];
        }
      } else {
        dataDraft[inputValue.name] = inputValue.type === 'checkbox' ? inputValue.checked : inputValue.value;
      }
    });
  }

  const data: INewCustomer = {
    shippingAddress: getShippingAddress(dataDraft),
    billingAddress: dataDraft.useShippingAddress ? undefined : getBillingAddress(dataDraft),
    firstName: dataDraft.firstName as string,
    lastName: dataDraft.lastName as string,
    email: dataDraft.email as string,
    dateOfBirth: new Date(dataDraft.dateOfBirth as string),
    password: Array.isArray(dataDraft.password) ? dataDraft.password[0] : (dataDraft.password as string),
  };
  return data;
}
