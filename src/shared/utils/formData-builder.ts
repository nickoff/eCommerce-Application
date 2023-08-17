import { Input } from '@components/shared/ui/input/input';

export function formDataBuilder(form: HTMLFormElement): void {
  const arrInput = Array.from(form.elements).filter((el) => el instanceof HTMLInputElement);
  arrInput.forEach((el) => {
    if (el instanceof HTMLInputElement && el.type === 'checkbox') return;
    (el.parentElement?.getComponent() as Input).validation();
  });
}
