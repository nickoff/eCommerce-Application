import { Input } from '@components/shared/ui/input/input';
import Select from '@components/shared/ui/select/select';

type ObjectData = Record<string, string | number | boolean | Date | string[]>;

export function formDataBuilder(form: HTMLFormElement): ObjectData {
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
  const data: ObjectData = {};
  if (!hasErrors) {
    arrInput.forEach((value) => {
      const inputValue = value as HTMLInputElement;
      if (data[inputValue.name]) {
        if (Array.isArray(data[inputValue.name])) {
          (data[inputValue.name] as string[]).push(inputValue.value);
        } else {
          data[inputValue.name] = [data[inputValue.name] as string, inputValue.value];
        }
      } else {
        data[inputValue.name] = inputValue.value;
      }
    });
  }
  // eslint-disable-next-line no-console
  console.log(data);
  return data;
}
