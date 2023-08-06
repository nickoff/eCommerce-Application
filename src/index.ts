import '@components/hello-world.scss';
import { heading } from '@components/hello-world';
import Img from '@assets/images/rsschool.png';

const img = new Image();
img.src = Img;

document.body.append(heading, img);
