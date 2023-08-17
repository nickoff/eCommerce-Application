export function formDataBuilder(form: HTMLFormElement): void {
  const arrInput = Array.from(form.elements).filter((el) => el instanceof HTMLInputElement);

  // eslint-disable-next-line no-console
  console.log(arrInput);
}
