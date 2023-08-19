import { IFormControl } from '@shared/interfaces/form-control.interface';
import { COMPONENT_CHILD_ATTR } from '@shared/constants/misc';

export async function isFormValid(form: HTMLFormElement): Promise<boolean> {
  const controls = [...form.elements];

  let result = true;

  await Promise.all(
    controls.map(async (ctrlEl) => {
      if (ctrlEl.hasAttribute(COMPONENT_CHILD_ATTR)) {
        const isValid = await ctrlEl.getComponent<IFormControl>().isValid();
        if (!isValid) result = false;
      }
    }),
  );

  return result;
}

export function buildFormData<T extends object>(form: HTMLFormElement): T {
  return Object.fromEntries(new FormData(form)) as T;
}
