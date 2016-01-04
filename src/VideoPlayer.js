import AMUIReact from 'amazeui-react';

import React from 'react';
import ReactDom from 'react-dom';

import cx from 'classnames';
import vjs from 'video.js'
import _forEach from 'lodash/collection/forEach';
import _debounce from 'lodash/function/debounce';
import _defaults from 'lodash/object/defaults';


//默认数值
var DEFAULT_HEIGHT = 800;
var DEFAULT_WIDTH = 600;
var DEFAULT_ASPECT_RATIO = (9 / 16);
var DEFAULT_ADJUSTED_SIZE = 0;
var DEFAULT_RESIZE_DEBOUNCE_TIME = 500;

var DEFAULT_VIDEO_OPTIONS = {
  preload: 'auto',
  autoplay: false,
  controls: true
};

var Plugin = require('./player/Plugin');

function noop() {
}

var Video = React.createClass({
  propTypes: {
    src: React.PropTypes.string.isRequired,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    endlessMode: React.PropTypes.bool,
    options: React.PropTypes.object,
    onReady: React.PropTypes.func,
    eventListeners: React.PropTypes.object,
    resize: React.PropTypes.bool,
    resizeOptions: React.PropTypes.shape({
      aspectRatio: React.PropTypes.number,
      shortWindowVideoHeightAdjustment: React.PropTypes.number,
      defaultVideoWidthAdjustment: React.PropTypes.number,
      debounceTime: React.PropTypes.number
    }),
    vjsDefaultSkin: React.PropTypes.bool,
    vjsBigPlayCentered: React.PropTypes.bool,
    children: React.PropTypes.element,
    dispose: React.PropTypes.bool,
    onNextVideo: React.PropTypes.func
  },
  getDefaultProps: function () {
    return {
      endlessMode: false,
      options: DEFAULT_VIDEO_OPTIONS,
      onReady: noop,
      eventListeners: {},
      resize: false,
      resizeOptions: {},
      vjsDefaultSkin: true,
      vjsBigPlayCentered: true,
      onNextVideo: noop
    };
  },
  componentDidMount: function () {
    this.mountVideoPlayer();
  },
  componentWillReceiveProps: function (nextProps) {
    var isEndless = this.props.endlessMode;
    var willBeEndless = nextProps.endlessMode;

    if (isEndless !== willBeEndless) {
      if (willBeEndless) {
        this.addEndlessMode();
      } else {
        this.removeEndlessMode();
      }
    }
    var isResizable = this.props.resize;
    var willBeResizeable = nextProps.resize;

    if (isResizable !== willBeResizeable) {
      if (willBeResizeable) {
        this.addResizeEventListener();
      } else {
        this.removeResizeEventListener();
      }
    }
    var currentSrc = this.props.src;
    var newSrc = nextProps.src;
    if (currentSrc !== newSrc) {
      this.setVideoPlayerSrc(newSrc);
    } else if (isEndless === willBeEndless) {
      this.restartVideo();
    }
  },
  shouldComponentUpdate: function () {
    return false;
  },
  componentWillUnmount: function () {
    this.unmountVideoPlayer();
  },
  getVideoPlayer: function () {
    return this._player;
  },
  getVideoPlayerEl: function () {
    return ReactDom.findDOMNode(this.refs.videoPlayer);
  },
  getVideoPlayerOptions: function () {
    return _defaults(
      {}, this.props.options, {
        //height: this.props.resize ? 'auto' : (this.props.height || DEFAULT_HEIGHT),
        //width: this.props.resize ? 'auto' : (this.props.width || DEFAULT_WIDTH)
      }, DEFAULT_VIDEO_OPTIONS);
  },
  getVideoResizeOptions: function () {
    return _defaults({}, this.props.resizeOptions, {
      aspectRatio: DEFAULT_ASPECT_RATIO,
      shortWindowVideoHeightAdjustment: DEFAULT_ADJUSTED_SIZE,
      defaultVideoWidthAdjustment: DEFAULT_ADJUSTED_SIZE,
      debounceTime: DEFAULT_RESIZE_DEBOUNCE_TIME
    });
  },

  getResizedVideoPlayerMeasurements: function () {
    var resizeOptions = this.getVideoResizeOptions();
    var aspectRatio = resizeOptions.aspectRatio;
    var defaultVideoWidthAdjustment = resizeOptions.defaultVideoWidthAdjustment;

    var winHeight = this._windowHeight();

    var baseWidth = this._videoElementWidth();

    var vidWidth = baseWidth - defaultVideoWidthAdjustment;
    var vidHeight = vidWidth * aspectRatio;

    if (winHeight < vidHeight) {
      var shortWindowVideoHeightAdjustment = resizeOptions.shortWindowVideoHeightAdjustment;
      vidHeight = winHeight - shortWindowVideoHeightAdjustment;
    }
    return {
      width: vidWidth,
      height: vidHeight
    };
  },
  setVideoPlayerSrc: function (src) {
    this._player.src(src);
  },
  //视频源弹幕地址加载
  mountVideoPlayer: function () {
    var src = this.props.src;
    var danmu = this.props.danmu;

    var options = this.getVideoPlayerOptions();

    this._player = vjs(this.getVideoPlayerEl(), options);

    var player = this._player;

    player.ready(this.handleVideoPlayerReady);

    _forEach(this.props.eventListeners, function (val, key) {
      player.on(key, val);
    });

    player.src(src);

    if (this.props.poster) {
      player.poster(this.props.poster);
    }

    if (this.props.endlessMode) {
      this.addEndlessMode();
    }

    //加载弹幕插件
    Plugin.load(player);
    player.ABP();
    player.danmu.load(danmu);
  },
  unmountVideoPlayer: function () {
    //资源回收
    this.removeResizeEventListener();
    this._player.dispose();
  },
  addEndlessMode: function () {
    var player = this._player;
    player.on('ended', this.handleNextVideo);
    if (player.ended()) {
      this.handleNextVideo();
    }
  },
  addResizeEventListener: function () {
    var debounceTime = this.getVideoResizeOptions().debounceTime;

    this._handleVideoPlayerResize = _debounce(this.handleVideoPlayerResize, debounceTime);
    window.addEventListener('resize', this._handleVideoPlayerResize);
  },
  removeEndlessMode: function () {
    var player = this._player;
    player.off('ended', this.handleNextVideo);
  },
  removeResizeEventListener: function () {
    window.removeEventListener('resize', this._handleVideoPlayerResize);
  },
  pauseVideo: function () {
    this._player.pause();
  },
  playVideo: function () {
    this._player.play();
  },
  restartVideo: function () {
    this._player.currentTime(0).play();
  },
  togglePauseVideo: function () {
    if (this._player.paused()) {
      this.playVideo();
    } else {
      this.pauseVideo();
    }
  },
  handleVideoPlayerReady: function () {
    this
      .getVideoPlayerEl()
      .parentElement
      .removeAttribute('data-reactid');

    if (this.props.resize) {
      this.handleVideoPlayerResize();
      this.addResizeEventListener();
    }
    this.props.onReady();
  },
  handleVideoPlayerResize: function () {
    var player = this._player;
    var videoMeasurements = this.getResizedVideoPlayerMeasurements();
    player.dimensions(videoMeasurements.width, videoMeasurements.height);
  },
  handleNextVideo: function () {
    this.props.onNextVideo();
  },
  renderDefaultWarning: function () {
    return (
      <p className="vjs-no-js">都什么年头了...浏览器还不支持Html5...</p>
    );
  },
  _windowHeight: function () {
    return window.innerHeight;
  },
  _videoElementWidth: function () {
    return this.getVideoPlayerEl().parentElement.parentElement.offsetWidth;
  },
  render: function () {
    var videoPlayerClasses = cx({
      'video-js': true,
      'vjs-default-skin': this.props.vjsDefaultSkin,
      'vjs-big-play-centered': this.props.vjsBigPlayCentered
    });
    return (
      <video ref="videoPlayer" className={videoPlayerClasses}>
        {this.props.children || this.renderDefaultWarning()}
      </video>
    );
  }
});

module.exports = Video;
