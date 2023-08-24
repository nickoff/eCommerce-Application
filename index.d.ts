declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.gif';
declare module '*.module.scss';
declare module '*.module.css';

declare module '*.svg' {
  const value: SVGElement;
  export default value;
}
