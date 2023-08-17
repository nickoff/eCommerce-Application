/* eslint-disable prefer-const */
import { Input } from '@components/shared/ui/input/input';
import Select from '@components/shared/ui/select/select';

type ObjectData = Record<string, string | File | number | boolean | Date>;

export function formDataBuilder(form: HTMLFormElement): void {
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
      if (!(el.parentElement?.getComponent() as Input).validation()) {
        hasErrors = true;
      }
    }
  });
  const data: ObjectData = {};
  if (!hasErrors) {
    const formData = new FormData(form);
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // eslint-disable-next-line no-console
    console.log(data);
  }
}
