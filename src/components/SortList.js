import React from 'react';
import AMUIReact from 'amazeui-react';

import Lib from '../Lib'

export default React.createClass({
  getInitialState: function () {
    return {
      list: [],
      error: false,
      page: 1,
      isLoad: false
    };
  },
  refreshList:function(page){
    var oldList = this.state.list;
    $.ajax({
      method: "get",
      url: Lib.BaseUrl + '/sort/' + this.props.params.mid + '?count=10&page=' + page,
      context: this,
      success: function (data) {
        if ( data.code == 0) {
          var list = [];
          for (var key in data.list) {
            if (data.list.hasOwnProperty(key)) {
              var video = data.list[key];
              list.push({
                title: video.title,
                link: '#/play/' + video.aid,
                desc: video.description,
                img: video.pic
              });
            }
          }
          if (this.isMounted()) {
            list = oldList.concat(list);
            this.setState({
              list: list,
              isLoad: true,
              page:page
            });
          }
        }else{
          this.setState({error: true});
        }
      },
      error: function () {
        this.setState({error: true});
      }
    });
  },
  //初始化
  componentDidMount: function () {
    this.refreshList(1);
  },
  pageAdd: function () {
    this.refreshList(this.state.page + 1);
  },
  render() {
    var data = {
      main: this.state.list
    };
    var handler = function () {
      this.pageAdd();
    }.bind(this);
    if (this.state.error) {
      return <Lib.ErrorWidght />
    }
    return (this.state.isLoad) ? (
      <div>
        <AMUIReact.Titlebar theme="cols" title={ Lib.Sorts[this.props.params.mid] } key="title"/>
        <AMUIReact.ListNews data={data} thumbPosition="left" key="list"/>
        <p className="am-text-center"><Lib.LoadingButton block clickHandler={handler} loadingText="正在加载..." key="load-btn">加载更多</Lib.LoadingButton>
        </p>
      </div>) : <Lib.LoadingWidght />;
  }
});
