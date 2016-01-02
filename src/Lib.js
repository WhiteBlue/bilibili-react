import React from 'react';
import AMUIReact from 'amazeui-react';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default {
  BaseUrl: 'http://localhost:8080',
  //分类
  Sorts: {
    1: '动画',
    13: '番剧',
    3: '音乐',
    129: '舞蹈',
    4: '游戏',
    36: '科技',
    5: '娱乐',
    119: '鬼畜'
  },
  //首页排序
  IndexList: ['动画', '音乐', '番剧', '舞蹈', '游戏', '科技', '娱乐', '鬼畜'],
  //读条部件
  LoadingWidght: React.createClass({
    render: function () {
      return <div className='am-text-center loading-content'>
        <i className='am-icon-refresh am-icon-spin am-icon-lg'/>
        <p>读条中</p>
      </div>;
    }
  }),
  //启动界面
  StartWidght: React.createClass({
    render: function () {
      return (<div className='am-text-center starting-content'>
          <ReactCSSTransitionGroup transitionName='index' transitionEnterTimeout={0} transitionLeaveTimeout={0} transitionAppear={true} transitionAppearTimeout={500}>
            <img className='start-bg' src='dist/images/bilibili_index.jpg'/>
          </ReactCSSTransitionGroup>
        </div>
      );
    }
  }),
  //错误部件
  ErrorWidght: React.createClass({
    render: function () {
      return <div className='am-text-center loading-content'>
        <i className='am-icon-exclamation-circle am-icon-lg'/>
        <p>加载失败,刷新下吧~</p>
      </div>;
    }
  }),
  FooterWidght:React.createClass({
    render:function(){
      return <div className='am-text-center index-footer'>
        <p>CopyRight©2016 WhiteBlue.</p>
      </div>
    }
  }),
  //加载按钮
  LoadingButton: React.createClass({
    getInitialState: function () {
      return {
        isLoading: false
      };
    },
    propTypes: {
      loadingText: React.PropTypes.string.isRequired,
      clickHandler: React.PropTypes.func
    },
    getDefaultProps: function () {
      return {
        loadingText: 'Loading',
        clickHandler: function () {
        }
      };
    },
    componentDidUpdate: function (prevProps, prevState) {
      if (this.state.isLoading) {
        this.props.clickHandler.call(this);
        this.setState({isLoading: false});
      }
    },
    handleClick: function () {
      this.setState({isLoading: true});
    },
    render: function () {
      var isLoading = this.state.isLoading;
      return (
        <AMUIReact.Button{...this.props} disabled={isLoading} onClick={!isLoading ? this.handleClick : null}>
          {isLoading ? this.props.loadingText : this.props.children}
        </AMUIReact.Button>
      );
    }
  })
};

