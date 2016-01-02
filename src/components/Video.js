import React from 'react';
import AMUIReact from 'amazeui-react';

import Lib from '../Lib'

export default React.createClass({
  getInitialState: function () {
    return {
      isLoad: false,
      error: false
    };
  },
  loadVideo: function () {
    $.ajax({
      method: "get",
      url: Lib.BaseUrl + '/view/' + this.props.params.aid,
      context: this,
      success: function (data) {
        var videoList = [];
        for (var i in data.list) {
          if (data.list.hasOwnProperty(i)) {
            videoList.push(data.list[i]);
          }
        }
        alert(videoList.length);
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
    return (this.state.isLoad) ? <div></div> : <div><Lib.LoadingWidght /></div>;
  }
});
