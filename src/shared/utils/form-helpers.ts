import { IFormControl } from '@shared/interfaces/form-control.interface';

export async function isFormValid(form: HTMLFormElement): Promise<boolean> {
  const controls = [...form.elements];

  let result = true;

  await Promise.all(
    controls.map(async (ctrl) => {
      if (['INPUT', 'SELECT'].includes(ctrl.tagName)) {
        const isValid = await ctrl.getComponent<IFormControl>().isValid();
        if (!isValid) result = false;
      }
    }),
  );

  return result;
}

export function buildFormData<T extends object>(form: HTMLFormElement): T {
  return Object.fromEntries(new FormData(form)) as T;
}
