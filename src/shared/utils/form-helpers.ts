import { IFormControl } from '@shared/interfaces/form-control.interface';

export function isFormValid(form: HTMLFormElement): boolean {
  const controls = [...form.elements];

  let result = true;

  controls.forEach((ctrl) => {
    if (['INPUT', 'SELECT'].includes(ctrl.tagName)) {
      const isValid = ctrl.getComponent<IFormControl>().isValid();
      if (!isValid) result = false;
    }
  });

  return result;
}

export function buildFormData<T extends object>(form: HTMLFormElement): T {
  return Object.fromEntries(new FormData(form)) as T;
}
