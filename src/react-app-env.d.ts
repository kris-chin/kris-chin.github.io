/// <reference types="react-scripts" />
declare module 'react-dom';
//modules for new types
declare module '*.json5'; //allow ts's compiler to recognize json5 files as importable (we can actually load it due to webpack loaders)
declare module '*.txt'; 