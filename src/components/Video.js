import React from 'react';
import AMUIReact from 'amazeui-react';

import Lib from '../Lib'
import Player from '../Player'


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
      isLoad: false,
      error: false,
      data: null,
      video: null
    };
  },
  loadVideo: function () {
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
        var video = videoList.shift();
        if (this.isMounted()) {
          this.setState({
            video: video,
            data: data,
            isLoad: true
          });
        }
      },
      error: function () {
        this.setState({error: true});
      }
    });
  },
  componentDidMount: function () {
    this.loadVideo();
  },
  render: function () {
    if (this.state.error) {
      return <Lib.ErrorWidght />
    }
    return (this.state.isLoad) ?
      <div><Player cid={this.state.video.cid} list={this.state.list}/><VideoInfo data={this.state.data}/></div> :
      <div><Lib.LoadingWidght /></div>;
  }
});
