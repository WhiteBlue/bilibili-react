import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
import App from './components/App';
import Sort from './components/Sort';
import SortList from './components/SortList';
import About from './components/About';
import Play from './Player';
import Video from './components/Video';

window.React = React;
//是否加载完成
window.load = false;

render(
  (<Router>
    <Route path="/" component={App}>
      <Route path="/about" component={About}/>
      <Route path="/sort" component={Sort}/>
      <Route path="/sort/:mid" component={SortList}/>
      <Route path="/play/:aid" component={Video}/>
    </Route>
  </Router>), document.getElementById('content')
);
