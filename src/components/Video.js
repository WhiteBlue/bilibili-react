import React from 'react';
import AMUIReact from 'amazeui-react';

import Lib from '../Lib'
//import Player from '../Player'

var Player = require('../VideoPlayer');

var VideoInfo = React.createClass({
  render: function () {
    var data = this.props.data;
    return <AMUIReact.Grid className='doc-g am-text-center'>
      <AMUIReact.Col md={8} mdOffset={2}>
        <AMUIReact.Col sm={4}>
          <AMUIReact.Thumbnail caption={data.author} src={data.face}/>
        </AMUIReact.Col>
        <AMUIReact.Col sm={8}>
          <AMUIReact.Panel header={data.title} amStyle='secondary'>
            <p>播放:{data.play} || 弹幕:{data.video_review} ||时间:{data.created_at}</p>
            <blockquote>{data.description}</blockquote>
          </AMUIReact.Panel>
        </AMUIReact.Col>
      </AMUIReact.Col>
    </AMUIReact.Grid>
  }
});


export default React.createClass({
  getInitialState: function () {
    return {
      //加载状态
      load: false,
      //播放器加载
      playerLoad: false,
      error: false,
      //视频信息
      data: null,
      //当前part的cid
      cid: null,
      //当前videoUrl
      videoUrl: null,
      //当前弹幕url
      danmuUrl: null,
      //分P列表
      partList: []
    };
  },
  loadInfo: function () {
    $.ajax({
      method: 'get',
      url: Lib.BaseUrl + '/view/' + this.props.params.aid,
      context: this,
      success: function (data) {
        var videoList = [];
        for (var i in data.list) {
          if (data.list.hasOwnProperty(i)) {
            videoList.push(data.list[i]);
          }
        }
        var video = videoList[0];
        this.setState({
          cid: video.cid,
          data: data,
          load: true,
          partList: videoList
        });
        this.loadVideo(video.cid, 1);
      },
      error: function () {
        this.setState({load: true, error: true});
      }
    });
  },
  loadVideo: function (cid, quality) {
    $.ajax({
      method: 'get',
      url: Lib.BaseUrl + '/video/' + cid + "/" + quality,
      context: this,
      success: function (data) {
        this.setState({videoUrl: data.url, danmuUrl: 'http://comment.bilibili.com/' + cid + '.xml', playerLoad: true});
      },
      error: function () {
        this.setState({error: true});
      }
    });
  },
  componentDidMount: function () {
    //初始化
    this.loadInfo();
  },
  //菜单点击监听
  handleClick: function (nav, index, e) {
    if (nav && nav.subMenu) {
    } else {
      e.preventDefault();
      if (index[0] == 0) {
        this.loadVideo(this.state.cid, index[1] + 1);
      } else {
        this.loadVideo(this.state.partList[index[1]].cid, 1);
      }
    }
  },
  render: function () {
    var data = [{
      link: '##',
      title: '清晰度',
      subCols: 3,
      subMenu: [{link: '##', title: '低清'}, {link: '##', title: '高清'}, {link: '##', title: '原画'}]
    }];
    if (this.state.partList.length > 1) {
      var menuList = [];
      for (var i = 0; i < this.state.partList.length; i++) {
        menuList.push({title: this.state.partList[i].part});
      }
      data.push({
        link: '##',
        title: '分集',
        subCols: 3,
        subMenu: menuList
      });
    }
    if (this.state.error) {
      return <Lib.ErrorWidght />
    }
    return (this.state.load) ?
      <div><AMUIReact.Menu cols={2} data={data} theme='dropdown2' onSelect={this.handleClick}/>
        <AMUIReact.Grid>
          <AMUIReact.Col md={8} mdOffset={2} id='video-container'>
            {this.state.playerLoad ?
              <Player src={ this.state.videoUrl } danmu={ this.state.danmuUrl } resize
                      poster={ this.state.data.pic }/> :
              <Lib.LoadingWidght />}
          </AMUIReact.Col>
        </AMUIReact.Grid>
        <VideoInfo data={this.state.data}/></div> :
      <div><Lib.LoadingWidght /></div>;
  }
});
