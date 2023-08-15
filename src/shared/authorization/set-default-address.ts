import { MouseEvtName } from '@shared/constants/events';

const setDefaultAdress = (): void => {
  const billingCheckbox: HTMLInputElement = <HTMLInputElement>document.querySelector('.billing-checkbox');

  billingCheckbox.addEventListener(MouseEvtName.CHANGE, () => {
    const shipingWrapper: HTMLElement = <HTMLElement>document.querySelector('.address-shiping');
    const billingWrapper: HTMLElement = <HTMLElement>document.querySelector('.billing-wrapper');
    const shipingInputs = shipingWrapper.querySelectorAll('input');
    const bilingInputs = billingWrapper.querySelectorAll('input');

    if (billingCheckbox.checked) {
      shipingInputs.forEach((input, index) => {
        input.addEventListener(MouseEvtName.CHANGE, () => {
          if (billingCheckbox.checked) bilingInputs[index].value = input.value;
        });
        bilingInputs[index].value = input.value;
        bilingInputs[index].disabled = true;
      });
    } else {
      bilingInputs.forEach((input, index) => {
        bilingInputs[index].value = '';
        bilingInputs[index].disabled = false;
      });
    }
  });
};
export default setDefaultAdress;
