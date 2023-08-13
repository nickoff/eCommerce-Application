import { Input } from '@components/shared/ui/input/Input';
import './styles/main.scss';
import Header from '@components/layout/header/header';
import { InputName } from '@shared/enums';

const myInput = new Input({
  name: InputName.City,
  labelText: 'My country',
});

const myInput2 = new Input({
  name: 'hello',
  labelText: 'No valid',
});

document.body.append(new Header().render(), myInput.render(), myInput2.render());
