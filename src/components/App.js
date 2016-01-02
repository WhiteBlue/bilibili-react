import React from 'react';
import { Link }  from 'react-router';
import AMUIReact from 'amazeui-react';

import Lib from '../Lib'

var IndexHeader = React.createClass({
  render: function () {
    var props = {
      title: 'BiliBili-Html5',
      link: '#/',
      data: {
        left: [
          {
            link: '#/about',
            icon: 'info'
          }
        ]
      }
    };
    return <AMUIReact.Header {...props} className='am-header-fixed'/>;
  }
});


var IndexList = React.createClass({
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
        var navData = [{
          title: '更新于 : 2016-1-3 20:8'
        }];
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
            renderResult.push(<div key={ sortName }><AMUIReact.Divider /><AMUIReact.Titlebar theme='multi' title={ sortName } nav={navData}/>
              <AMUIReact.Gallery theme='bordered' data={ renderList }/></div>);
          }
        }
        var loadClear = function () {
          if (this.isMounted()) {
            this.setState({
              list: renderResult,
              isLoad: true
            });
            window.load = true;
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
    return (this.state.isLoad) ? <div>{ this.state.list }</div> : (window.load ? <Lib.LoadingWidght /> :
      <Lib.StartWidght />);
  }
});


export const DefaultFooter = React.createClass({
  render: function () {
    var data = [
      {
        title: '分类',
        link: '#/sort',
        icon: 'tag'
      },
      {
        title: '追番',
        link: '#/bangumi',
        icon: 'tasks'
      },
      {
        title: '搜索',
        link: '#/search',
        icon: 'search'
      }
    ];
    return <AMUIReact.Navbar data={data}/>
  }
});

export default React.createClass({
  render() {
    return (
      <div>
        <IndexHeader />
        <section>
          {this.props.children || <IndexList />}
        </section>
        <DefaultFooter />
      </div>
    )
  }
});
