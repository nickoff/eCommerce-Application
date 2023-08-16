/* eslint-disable no-console */
import './styles/main.scss';
import Header from '@components/layout/header/header';
import Main from '@components/layout/main/main';

document.body.append(new Header().render(), Main.render());
