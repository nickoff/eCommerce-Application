import { Input } from '@components/shared/ui/input/Input';
import './styles/main.scss';
import Header from '@components/layout/header/header';
import { InputName } from '@shared/enums';

const myPhone = new Input({ name: InputName.Phone, labelText: 'Phone' });

document.body.append(new Header().render(), myPhone.render());
