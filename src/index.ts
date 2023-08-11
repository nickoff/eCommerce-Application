import './styles/main.scss';
import { Input, InputTypes } from '@components/shared/ui/input/Input';

const newInput = new Input({
  type: InputTypes.email,
  labelText: 'Email',
});

document.body.append(newInput.render());
