import React from 'react';
import AMUIReact from 'amazeui-react';

import loadVideojs from './player/DanmuPlayer'

import Lib from './Lib'

export default React.createClass({
  getVideo: function (cid, quality) {
    $.ajax({
      method: 'get',
      url: Lib.BaseUrl + '/video/' + cid + "?quality=" + quality,
      context: this,
      success: function (data) {
        this.videoPlayer.load(data.url, 'http://comment.bilibili.com/' + cid + '.xml');
      },
      error: function () {
        this.setState({error: true});
      }
    });
  },
  //播放器资源回收
  playerClear: function () {
    if (this.hasOwnProperty('videoPlayer')) {
      this.videoPlayer.clearPlayer();
    }
  },
  getInitialState: function () {
    return {
      cid: null,
      quality: 1,
      error: false
    };
  },
  componentDidMount: function () {
    this.setState({cid: this.props.cid});
  },
  componentDidUpdate: function (prevProps, prevState) {
    this.videoPlayer = loadVideojs('danmaku_player', {
      controls: true,
      preload: 'auto',
      width: document.getElementById('video-container').offsetWidth
    });
    this.getVideo(this.state.cid, this.state.quality);
  },
  componentWillUnmount: function () {
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
    }
  },
  render: function () {
    var list = this.props.list;
    var menuList = [];
    for (var part in list) {
      if (list.hasOwnProperty(part)) {
        menuList.push({
          title: list[part].part
        });
      }
    }
    var data = [{
      link: '##',
      title: '清晰度',
      subCols: 2,
      subMenu: [{link: '##', title: '低清'}, {link: '##', title: '高清'}, {link: '##', title: '原画'}]
    }];
    if (menuList.length > 0) {
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
    return <AMUIReact.Grid>
      <AMUIReact.Menu cols={3} data={data} theme='dropdown2' onSelect={this.handleClick}/>
      <AMUIReact.Col md={8} mdOffset={2} id='video-container' style={{padding:'0'}}>
        <video id='danmaku_player' className='video-js vjs-default-skin'/>
      </AMUIReact.Col>
    </AMUIReact.Grid>;
  }
});





