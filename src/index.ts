import './styles/main.scss';
import Header from '@components/layout/header/header';
import Main from '@components/layout/main/main';
import showAuthorizationPage from '@shared/authorization/show-authorization-page';

document.body.append(new Header().render());
document.body.append(new Main().render());

showAuthorizationPage();
