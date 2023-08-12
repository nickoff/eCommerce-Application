import './styles/main.scss';
import Header from '@components/layout/header/header';
import { Input } from '@components/shared/ui/input/Input';
import { InputName } from '@shared/enums';

const newInput = new Input({
  name: InputName.DateOfBirth,
  labelText: 'First name',
});

document.body.append(new Header().render(), newInput.render());
