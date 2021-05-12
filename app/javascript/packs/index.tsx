import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HomePage } from '../containers/guest/HomePage';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<HomePage />, document.body.appendChild(document.createElement('div')));
});
