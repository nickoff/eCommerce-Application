import './styles/main.scss';
import { Input, InputTypes } from '@components/shared/ui/input/Input';

const newInput = new Input({
  type: InputTypes.password,
});

document.body.append(newInput.render());
