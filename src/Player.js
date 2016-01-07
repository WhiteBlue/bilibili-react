import React from 'react';
import AMUIReact from 'amazeui-react';

import loadVideojs from './player/DanmuPlayer'

import Lib from './Lib'

export default React.createClass({
  //播放器资源回收
  playerClear: function () {
    if (this.hasOwnProperty('videoPlayer')) {
      this.videoPlayer.clearPlayer();
    }
  },
  getInitialState: function () {
    return {
      playerError: false
    };
  },
  componentDidMount: function () {
    try {
      var videoPlayer = loadVideojs('danmu-player', {
        controls: true,
        preload: 'auto',
        width: document.getElementById('video-container').offsetWidth,
        poster: this.props.poster
      });
      videoPlayer.clearDanmu();
      videoPlayer.load(this.props.video, this.props.danmu);
    } catch (err) {
      this.setState({playerError: true});
    }
  },
  componentWillUnmount: function () {
    //播放器销毁
    this.playerClear();
  },
  handleClick: function (nav, index, e) {
    if (nav && nav.subMenu) {
    } else {
      e.preventDefault();
      if (index[0] == 0) {
        this.setState({quality: index[1] + 1});
      } else {
        this.setState({cid: this.props.list[index[1]]});
      }
      this.closeAll();
    }
  },
  render: function () {
    if (this.state.error) {
      return <Lib.ErrorWidght />
    }
    return <AMUIReact.Grid>
      <AMUIReact.Col md={8} mdOffset={2} id='video-container'>
        <video className='video-js vjs-default-skin' id="danmu-player" resize="true"/>
      </AMUIReact.Col>
    </AMUIReact.Grid>;
  }
});





