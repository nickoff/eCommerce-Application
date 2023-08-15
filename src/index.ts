import { InputName } from '@shared/enums';
import './styles/main.scss';
import Header from '@components/layout/header/header';
import { Input } from '@components/shared/ui/input/Input';

const myInput = new Input({
  name: InputName.Password,
  labelText: 'Email',
});

document.body.append(new Header().render(), myInput.render());
