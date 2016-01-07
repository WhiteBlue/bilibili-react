import React from 'react';
import { Link }  from 'react-router';
import AMUIReact from 'amazeui-react';

import Lib from '../Lib'


var IndexPage = React.createClass({
  render: function () {
    var data = this.props.data;
    var banners = data.banners;
    var bannerInsert = [];
    for (var i = 0; i < banners.length; i++) {
      bannerInsert.push({img: banners[i].img, desc: banners[i].title, aid: banners[i].aid});
    }
    var recommands = data.recommends;
    var videosInsert = [];
    for (var j = 0; j < recommands.length; j++) {
      videosInsert.push({
        img: recommands[j].pic,
        link: '#/play/' + recommands[j].aid,
        title: recommands[j].title,
        desc: '点击:' + recommands[j].play + '||弹幕:' + recommands[j].video_review
      });
    }
    return <AMUIReact.Grid>
      <AMUIReact.Col md={8} mdOffset={2}>
        <AMUIReact.Slider>
          {bannerInsert.map(function (item, i) {
            return (
              <AMUIReact.Slider.Item key={i}>
                <a href={ '#/play/'+item.aid }>
                  <img src={item.img}/>
                  <div className="am-slider-desc">
                    {item.desc}
                  </div>
                </a>
              </AMUIReact.Slider.Item>
            );
          })}
        </AMUIReact.Slider>
        <AMUIReact.Titlebar title="热门推荐"/>
        <AMUIReact.Panel>
          <AMUIReact.Gallery theme='imgbordered' data={videosInsert}/>
        </AMUIReact.Panel>
      </AMUIReact.Col>
    </AMUIReact.Grid>
  }
});


var DefaultFooter = React.createClass({
  render: function () {
    var data = [
      {
        title: '分类',
        link: '#/sort',
        icon: 'tag'
      },
      {
        title: '排行',
        link: '#/rank',
        icon: 'tasks'
      },
      {
        title: '搜索',
        link: '#/search',
        icon: 'search'
      }
    ];
    return <AMUIReact.Navbar data={data}/>
  }
});

export default React.createClass({
  loadingStartData: function () {
    $.ajax({
      method: 'get',
      url: Lib.BaseUrl + '/indexinfo',
      context: this,
      success: function (data) {
        if (data.code == 0) {
          this.setState({load: true, data: data.result})
        } else {
          this.setState({error: true, load: true});
        }
      },
      error: function () {
        this.setState({error: true, load: true});
      }
    });
  },
  getInitialState: function () {
    return {
      data: null,
      load: false,
      error: false
    }
  },
  render() {
    if (!this.state.load) {
      this.loadingStartData();
      return <Lib.StartWidght />;
    }

    if (this.state.error) {
      return <Lib.BadErrorWidght />;
    }
    return (
      <div>
        <Lib.Header path={this.props.location.pathname}/>
        <section>
          {this.props.children ||
          <div className="am-animation-slide-bottom"><IndexPage data={ this.state.data }/></div>}
        </section>
        <DefaultFooter />
      </div>
    )
  }
});
