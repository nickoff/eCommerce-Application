import { Input } from '@components/shared/ui/input/input';
import Select from '@components/shared/ui/select/select';

export function formDataBuilder(form: HTMLFormElement): void {
  const arrInput = Array.from(form.elements).filter(
    (el) => el instanceof HTMLInputElement || el instanceof HTMLSelectElement,
  );
  arrInput.forEach((el) => {
    if (el instanceof HTMLInputElement && el.type === 'checkbox') return;
    if (el instanceof HTMLSelectElement) {
      (el.parentElement?.getComponent() as Select).toggleRequiredError();
    }
    if (el instanceof HTMLInputElement) {
      (el.parentElement?.getComponent() as Input).validation();
    }
  });
}
