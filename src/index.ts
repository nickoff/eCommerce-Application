/* eslint-disable no-console */
import './styles/main.scss';
import Header from '@components/layout/header/header';
import { Store } from '@app/store';

Store.getInstance()
  .init()
  .then(() => {
    document.body.append(new Header().render());
  });
