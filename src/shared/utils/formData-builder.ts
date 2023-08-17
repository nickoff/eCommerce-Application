import { Input } from '@components/shared/ui/input/input';
import Select from '@components/shared/ui/select/select';

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

  // eslint-disable-next-line no-console
  console.log(hasErrors);
}
