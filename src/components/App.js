import React from 'react';
import { Link }  from 'react-router';
import AMUIReact from 'amazeui-react';

var testData = require('../TestData.js');

var IndexHeader = React.createClass({
  render: function () {
    var props = {
      "title": "BiliBili-Html5",
      "link": "#/",
      data: {
        "left": [
          {
            "link": "#/left-link",
            "icon": "home"
          }
        ],
        "right": [
          {
            "link": "#/about",
            "icon": "info"
          }
        ]
      }
    };
    return <AMUIReact.Header {...props} className="am-header-fixed"/>;
  }
});


var IndexList = React.createClass({
  refreshApp: function () {


  },
  render: function () {
    var renderResult = [];
    var origin = testData.TestIndex;
    for (var type in origin) {
      var renderList = [];
      if (origin.hasOwnProperty(type)) {
        var list = origin[type];
        for (var i in list) {
          if (list.hasOwnProperty(i)) {
            var video = {
              img: list[i].pic,
              link: "#/play/" + list[i].aid,
              title: list[i].title,
              desc: list[i].create,
              key: list[i].aid
            };
            renderList.push(video);
          }
        }
        renderResult.push(<div key={ type }><AMUIReact.Titlebar theme="cols" title={ type } key={ type }/>
          <AMUIReact.Gallery theme="bordered" data={ renderList } key={ renderList.key }/></div>);
      }
    }
    return <div>{ renderResult }</div>;
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
