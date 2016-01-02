import React from 'react';
import AMUIReact from 'amazeui-react';

import loadVideojs from '../player/DanmuPlayer'


var VideoPlayer = React.createClass({
  getInitialState: function () {
    return {
      width: null,
      height: null,
      videoUrl: this.props.videoUrl,
      danmuUrl: this.props.danmuUrl
    };
  },
  updateDimensions: function () {
    this.setState({
      width: document.getElementById('video-container').offsetWidth,
      height: document.body.scrollHeight * 0.7
    });
  },
  componentDidMount: function () {
    //DOM加载完成
    this.videoPlayer = loadVideojs('danmaku_player', {
      "controls": true,
      "preload": "auto",
      "width": document.getElementById('video-container').offsetWidth,
      "height": (document.body.scrollHeight * 0.7)
    });
    this.videoPlayer.load(this.props.videoUrl, this.props.danmuUrl);
    window.addEventListener("resize", this.updateDimensions);
  },
  componentWillUpdate: function (nextProps, nextState) {
    //大小调整
    this.videoPlayer.changeSize(nextState.width, nextState.height);
  },
  componentWillUnmount: function () {
    //清除播放器
    this.videoPlayer.clearPlayer();
  },
  render: function () {
    return <div className="video-container">
      <video id="danmaku_player" className="video-js vjs-default-skin"/>
    </div>;
  }
});


export default React.createClass({
  getInitialState: function () {
    return {
      quality: 1,
      videoUrl: null,
      danmuUrl: null
    };
  },
  handleClick: function (nav, index, e) {
    if (nav && nav.subMenu) {
    } else {
      e.preventDefault();
      if (index[0] == 0) {
        alert('切换清晰度为:' + (index[1] + 1));
      } else {
        alert('切换分集为:' + (index[1] + 1));
      }
    }
  },
  getVideoUrl: function () {

  },
  render() {
    var data = [{
      link: '##',
      title: '清晰度',
      subCols: 2,
      subMenu: [{link: '##', title: '低清'}, {link: '##', title: '高清'}, {link: '##', title: '原画'}]
    }, {
      link: '##',
      title: '分集',
      subCols: 3,
      subMenu: [{link: '##', title: 'part1'}]
    }];
    return (
      <AMUIReact.Grid>
        <AMUIReact.Menu cols={3} data={data} theme="dropdown2" onSelect={this.handleClick}/>
        <AMUIReact.Col md={8} mdOffset={2} id="video-container" style={{padding:"0"}}>
          <h2>Your choice:{ this.props.params.aid }</h2>
          <VideoPlayer videoUrl="4779642.mp4" danmuUrl="http://comment.bilibili.com/5225640.xml"/>
        </AMUIReact.Col>
      </AMUIReact.Grid>
    );
  }
});
