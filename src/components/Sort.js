import React from 'react';
import AMUIReact from 'amazeui-react';
import Lib from '../Lib'

const SortList = React.createClass({
  render(){
    var list = [];
    for (var key in Lib.Sorts) {
      if (Lib.Sorts.hasOwnProperty(key)) {
        list.push(<AMUIReact.ListItem href={ '#/sort/'+key } key={key} >{ Lib.Sorts[key] }</AMUIReact.ListItem>);
      }
    }
    return (
      <div>
        <AMUIReact.List border>{list}</AMUIReact.List>
      </div>
    );
  }
});

export default React.createClass({
  render() {
    return (
      <div>
        <SortList />
      </div>
    );
  }
});
