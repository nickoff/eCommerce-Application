import './styles/main.scss';
import Header from '@components/layout/header/header';
import Main from '@components/layout/main/main';
import showLoginPage from '@pages/login/show-login-page';

document.body.append(new Header().render());
document.body.append(new Main().render());

showLoginPage();
