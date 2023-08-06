declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.gif';

declare module '*.svg' {
  const value: string;
  export default value;
}
