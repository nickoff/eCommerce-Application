import './styles/main.scss';
import Header from '@components/layout/header/header';
import { Input, InputTypes } from '@components/shared/ui/input/Input';

const newInput = new Input({
  type: InputTypes.email,
  labelText: 'Email',
});

document.body.append(new Header().render(), newInput.render());
