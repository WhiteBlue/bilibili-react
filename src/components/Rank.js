import React from 'react';
import { Link }  from 'react-router';
import AMUIReact from 'amazeui-react';

import Lib from '../Lib'

var RankList = React.createClass({
  getInitialState: function () {
    return {
      list: [],
      error: false,
      isLoad: false
    };
  },
  refreshApp: function () {
    $.ajax({
      method: 'get',
      url: Lib.BaseUrl + '/topinfo',
      context: this,
      success: function (data) {
        var renderResult = [];
        for (var i = 0; i < Lib.IndexList.length; i++) {
          var sortName = Lib.IndexList[i];
          if (data.hasOwnProperty(sortName)) {
            var list = data[sortName];
            var renderList = [];
            for (var j = 0; j < list.length - 1; j++) {
              renderList.push({
                img: list[j].pic,
                link: '#/play/' + list[j].aid,
                title: list[j].title,
                desc: list[j].create
              });
            }
            renderResult.push(<div key={ sortName }><AMUIReact.Divider />
              <AMUIReact.Titlebar theme='cols' title={ sortName }/>
              <AMUIReact.Gallery theme='bordered' data={ renderList }/></div>);
          }
        }
        var loadClear = function () {
          if (this.isMounted()) {
            this.setState({
              list: renderResult,
              isLoad: true
            });
          }
        }.bind(this);

        if (!window.load) {
          setTimeout(function () {
            loadClear();
          }.bind(this), 500);
        } else {
          loadClear();
        }
      },
      error: function () {
        this.setState({error: true});
      }
    });
  },
  componentDidMount: function () {
    this.refreshApp();
  },
  render: function () {
    if (this.state.error) {
      return <Lib.ErrorWidght />
    }
    return (this.state.isLoad) ? <div>{ this.state.list }</div> : <Lib.LoadingWidght />;
  }
});


export default React.createClass({
  render: function () {
    return <RankList />;
  }
});
