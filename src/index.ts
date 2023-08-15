/* eslint-disable no-console */
import './styles/main.scss';
import { Store } from '@app/store';
import Header from '@components/layout/header/header';
import Main from '@components/layout/main/main';
import showEntryOrLoginPage from '@shared/authorization/show-entry-or-login-page';
import setDefaultAdress from '@shared/authorization/set-default-address';

Store.getInstance()
  .init()
  .then(() => {
    document.body.append(new Header().render(), new Main().render());

    showEntryOrLoginPage();
    setDefaultAdress();
  });
