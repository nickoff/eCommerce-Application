import './styles/main.scss';
import Header from '@components/layout/header/header';
import { Input, InputNames } from '@components/shared/ui/input/Input';

const newInput = new Input({
  name: InputNames.email,
  labelText: 'Password',
});

document.body.append(new Header().render(), newInput.render());
