import './styles/main.scss';
import Header from '@components/layout/header/header';
import Main from '@components/layout/main/main';
import showEntryOrLoginPage from '@shared/authorization/show-entry-or-login-page';
import setDefaultAdress from '@shared/authorization/set-default-adress';

document.body.append(new Header().render(), new Main().render());

showEntryOrLoginPage();
setDefaultAdress();
