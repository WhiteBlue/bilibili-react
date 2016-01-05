import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';


import App from './components/App';
import Sort from './components/Sort';
import SortList from './components/SortList';
import About from './components/About';
import Video from './components/Video';
import Search from './components/Search';
import SP from './components/SP';
import Rank from './components/Rank';

$(document).ready(function () {
  window.React = React;

  var Back = React.createClass({
    render: function () {
      history.go(-2);
      return <div></div>
    }
  });

  render(
    (<Router>
      <Route path="/" component={App}>
        <Route path="/about" component={About}/>
        <Route path="/sort" component={Sort}/>
        <Route path="/search" component={Search}/>
        <Route path="/sort/:mid" component={SortList}/>
        <Route path="/play/:aid" component={Video}/>
        <Route path="/sp/:spid" component={SP}/>
        <Route path="/rank" component={Rank}/>
        <Route path="/back" component={Back}/>
      </Route>
    </Router>), document.getElementById('content')
  );
});


