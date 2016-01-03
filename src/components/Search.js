import React from 'react';
import AMUIReact from 'amazeui-react';

import Lib from '../Lib'

var VideoList = React.createClass({
  render: function () {
    var list = this.props.list;
    var insetList = [];
    for (var i = 0; i < list.length; i++) {
      insetList.push({
        title: list[i].title,
        link: '#/play/' + list[i].aid,
        desc: list[i].description,
        img: list[i].pic
      });
    }
    var data = {
      header: {
        title: '视频'
      },
      main: insetList
    };
    return <AMUIReact.ListNews data={data} thumbPosition='left' key='list'/>;
  }
});


var UpUserList = React.createClass({
  render: function () {
    var list = this.props.list;
    var insetList = [];
    for (var i = 0; i < list.length; i++) {
      insetList.push({
        title: list[i].uname,
        link: '#',
        desc: list[i].usign,
        img: list[i].upic
      });
    }
    var data = {
      header: {
        title: '用户'
      },
      main: insetList
    };
    return <AMUIReact.ListNews data={data} thumbPosition='left' key='list'/>;
  }
});


var BangumiList = React.createClass({
  render: function () {
    var list = this.props.list;
    var insetList = [];
    for (var i = 0; i < list.length; i++) {
      insetList.push({
        title: list[i].title,
        link: '#',
        desc: list[i].evaluate,
        img: list[i].cover
      });
    }
    var data = {
      header: {
        title: '新番'
      },
      main: insetList
    };
    return <AMUIReact.ListNews data={data} thumbPosition='left' key='list'/>;
  }
});


var SPList = React.createClass({
  render: function () {
    var list = this.props.list;
    var insetList = [];
    for (var i = 0; i < list.length; i++) {
      insetList.push({
        title: list[i].title,
        link: '#',
        desc: list[i].description,
        img: list[i].pic
      });
    }
    var data = {
      header: {
        title: '专题'
      },
      main: insetList
    };
    return <AMUIReact.ListNews data={data} thumbPosition='left' key='list'/>;
  }
});


//总容器
var ContentList = React.createClass({
  render: function () {
    var type = this.props.type;
    if (this.props.data[type].length > 0) {
      var allData = this.props.data;
      var rendList = [];
      switch (type) {
        case 'video':
          rendList.push(<VideoList key="videoList" list={ allData.video }/>);
          break;
        case 'upuser':
          rendList.push(<UpUserList key="upList" list={ allData.upuser }/>);
          break;
        case 'bangumi':
          rendList.push(<BangumiList key="bangumiList" list={ allData.bangumi }/>);
          break;
        case 'special':
          rendList.push(<SPList key="spList" list={ allData.special }/>);
          break;
      }
      if (!this.props.noMore) {
        rendList.push(<Lib.LoadingButton block clickHandler={this.props.handler} loadingText='正在加载...' key='load-btn'>加载更多</Lib.LoadingButton>)
      }
      return <div>{rendList}</div>;
    }
    return <div>null</div>;
  }
});


var selectData = [
  {link: 'video', title: '视频'},
  {link: 'bangumi', title: '新番'},
  {link: 'special', title: '专题'},
  {link: 'upuser', title: 'up主'}];


var SearchContent = React.createClass({
  getSearch: function (content, page, order, type) {
    $.ajax({
      method: 'post',
      url: Lib.BaseUrl + '/search',
      data: {content: content, count: 15, page: page, order: order},
      context: this,
      success: function (data) {

        var allData = this.state.data;
        var oldNum = this.state.data[type].length;
        if (page == 1) {
          allData[type] = data.result[type];
        } else {
          allData[type] = allData[type].concat(data.result[type]);
        }
        if (allData[type].length == oldNum) {
          this.setState({
            content: content,
            noMore: true,
            loading: false,
            type: type,
            page: page
          });
        } else {
          this.setState({
            content: content,
            data: allData,
            loading: false,
            page: page,
            type: type
          });
        }
      },
      error: function () {
        this.setState({error: true});
      }
    });
  },
  getInitialState: function () {
    return {
      content: null,
      error: false,
      loading: false,
      order: 'hot',
      type: 'video',
      page: 1,
      noMore: false,
      data: {video: [], bangumi: [], special: [], upuser: []}
    };
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var value = document.getElementById('search_content').value;
    this.getSearch(value, this.state.page, this.state.order, this.state.type);
    this.setState({loading: true});
  },
  //切换分类
  handleTypeClick: function (nav, index, e) {
    if (nav) {
      e.preventDefault();
      this.getSearch(this.state.content, 1, this.state.order, nav.link);
    }
  },
  pageAdd: function () {
    alert(this.state.page + 1);
    this.getSearch(this.state.content, this.state.page + 1, this.state.order, this.state.type);
  },
  render: function () {
    var btnSearch = <AMUIReact.Button type='submit'><AMUIReact.Icon icon="search"/></AMUIReact.Button>;
    return <div>
      <AMUIReact.Grid>
        <AMUIReact.Col md={8} mdOffset={2}>
          <AMUIReact.Form onSubmit={this.handleSubmit} id="search-form">
            <AMUIReact.Input placeholder="要搜索的内容" id='search_content' btnAfter={btnSearch}/></AMUIReact.Form>
        </AMUIReact.Col>
      </AMUIReact.Grid>
      <AMUIReact.Grid>
        <AMUIReact.Col md={8} mdOffset={2}>
          {(this.state.error ? (<Lib.ErrorWidght />) : (this.state.loading ? <Lib.LoadingWidght /> :
            <div><AMUIReact.Menu cols={4} data={selectData} onSelect={this.handleTypeClick}/>
              <ContentList handler={ this.pageAdd } noMore={ this.state.noMore} data={ this.state.data }
                           type={ this.state.type }/></div>))}
        </AMUIReact.Col>
      </AMUIReact.Grid>
    </div>;
  }
});

export default React.createClass({
  render: function () {
    return <SearchContent />;
  }
});
