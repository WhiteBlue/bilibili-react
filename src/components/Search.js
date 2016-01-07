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
        link: '#/sp/' + list[i].spid,
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
        link: '#/sp/' + list[i].spid,
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
      if (this.props.allPage[type] > this.props.page) {
        rendList.push(<Lib.LoadingButton block clickHandler={this.props.handler} loadingText='正在加载...' key='load-btn'>加载更多</Lib.LoadingButton>)
      }
      return <div>{rendList}</div>;
    }
    return <Lib.NoMoreWidght />;
  }
});


var selectData = [
  {link: 'video', title: '视频'},
  {link: 'bangumi', title: '新番'},
  {link: 'special', title: '专题'},
  {link: 'upuser', title: 'up主'}];

var SearchContent = React.createClass({
  getSearch: function (content, page, order) {
    $.ajax({
      method: 'post',
      url: Lib.BaseUrl + '/search',
      data: {content: content, count: 15, page: page, order: order},
      context: this,
      success: function (data) {
        var allData = this.state.data;
        //页码为1重置
        if (page == 1) {
          allData = {video: [], bangumi: [], special: [], upuser: []};
        }
        for (var dataType in allData) {
          allData[dataType] = allData[dataType].concat(data.result[dataType]);
        }
        var allPage = {
          video: data.page_info.video.pages,
          bangumi: data.page_info.bangumi.pages,
          special: data.page_info.special.pages,
          upuser: data.page_info.upuser.pages
        };
        this.setState({
          content: content,
          data: allData,
          loading: false,
          page: page,
          allPage: allPage,
          error: false,
          isLoad: true
        });
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
      //默认分类
      type: 'video',
      page: 1,
      //总共页数
      allPage: {video: 1, bangumi: 1, special: 1, upuser: 1},
      //各分类分页数据
      data: {video: [], bangumi: [], special: [], upuser: []},
      //是否首次访问
      isLoad: false
    };
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var value = document.getElementById('search_content').value;
    this.getSearch(value, 1, this.state.order);
    this.setState({loading: true});
  },
  //切换分类
  handleTypeClick: function (nav, index, e) {
    if (nav) {
      e.preventDefault();
      if (this.state.type != nav.link) {
        this.setState({type: nav.link});
      }
    }
  },
  pageAdd: function () {
    this.getSearch(this.state.content, this.state.page + 1, this.state.order);
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
            (this.state.isLoad) ? <div><AMUIReact.Menu cols={4} data={selectData} onSelect={this.handleTypeClick}/>
              <ContentList handler={ this.pageAdd } allPage={ this.state.allPage} data={ this.state.data }
                           type={ this.state.type } page={ this.state.page }/></div> : <div></div>))}
        </AMUIReact.Col>
      </AMUIReact.Grid>
    </div>;
  }
});

export default React.createClass({
  render: function () {
    return <div className="am-animation-slide-left">
      <SearchContent />
    </div>;
  }
});
