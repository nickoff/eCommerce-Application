import { element } from 'tsx-vanilla';
import { render } from '@shared/utils/misc';
import Header from './header/header';
import Main from './main/main';
import * as s from './layout.module.scss';
import Footer from './footer/footer';

export default function Layout(): JSX.Element {
  return <div id={s.appRoot}>{render(new Header(), Main.class(s.appMain), new Footer())}</div>;
}
