import videojs from 'video.js'


export default function loadVideojs(element_id, params) {
  var videoPlayer = {
    videoJs: videojs(element_id, params)
  };
  videoPlayer.load = function (video, danmu) {
    this.videoJs.src(video);
    //this.videoJs.ABP();
    //this.videoJs.danmu.load(danmu);
  };
  videoPlayer.changeSize = function (width, height) {
    this.videoJs.width(width);
    this.videoJs.height(height);
  };
  videoPlayer.clearPlayer = function () {
    this.videoJs.dispose();
  };
  videoPlayer.clearDanmu=function(){
    if(this.videoJs.hasOwnProperty('danmu')){
      this.videoJs.danmu.cmManager.clear();
    }
  };

  return videoPlayer;
}

