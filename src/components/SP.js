import React from 'react';
import AMUIReact from 'amazeui-react';
import Lib from '../Lib'

var selectData = [
  {link: '0', title: '视频'},
  {link: '1', title: '番剧'}
];


var Gallery = React.createClass({
  render: function () {
    if (this.props.list.length > 0) {
      return <AMUIReact.Gallery theme='bordered' data={ this.props.list }/>
    } else {
      return <Lib.NoMoreWidght />;
    }
  }
});

var SP = React.createClass({
  getVideos: function (bangumi) {
    var list = [];
    $.ajax({
      method: 'get',
      url: Lib.BaseUrl + '/spvideos/' + this.props.spid + '?bangumi=' + bangumi,
      context: this,
      success: function (data) {
        for (var i = 0; i < data.list.length; i++) {
          list.push({
            img: data.list[i].cover,
            link: '#/play/' + data.list[i].aid,
            title: data.list[i].title
          });
        }
        this.setState({list: list, loadingVideo: false});
      },
      error: function () {
        this.setState({error: true, loadingVideo: false});
      }
    });
  },
  getSpInfo: function () {
    $.ajax({
      method: 'get',
      url: Lib.BaseUrl + '/spinfo/' + this.props.spid,
      context: this,
      success: function (data) {
        this.setState({data: data, loading: false});
      },
      error: function () {
        this.setState({error: true, loading: false});
      }
    });
  },
  getInitialState: function () {
    return {
      bangumi: 0,
      list: [],
      data: null,
      loading: true,
      loadingVideo: true,
    };
  },
  componentDidMount: function () {
    this.getSpInfo();
    this.getVideos(0);
  },
  handleTypeClick: function (nav, index, e) {
    if (nav) {
      e.preventDefault();
      if (this.state.bangumi != nav.link) {
        this.setState({bangumi: nav.link, loadingVideo: true});
        this.getVideos(nav.link);
      }
    }
  },
  render(){
    if (this.state.loading) {
      return <Lib.LoadingWidght />;
    }
    return <div>
      <AMUIReact.Grid className="doc-g">
        <AMUIReact.Col md={8} mdOffset={2} className="am-text-center">
          <AMUIReact.Thumbnail standalone src={ this.state.data.cover } style={{marginLeft:'auto',marginRight:'auto'}}/>
          <AMUIReact.Article title={ this.state.data.title }>
            <AMUIReact.Article.Child role="lead">{ this.state.data.description }</AMUIReact.Article.Child>
          </AMUIReact.Article>
          <div className="am-text-center">{this.state.error ? <Lib.ErrorWidght /> : (<div>
              {this.state.loadingVideo ? <Lib.LoadingWidght /> :
                <div><AMUIReact.Menu theme="slide1" cols={2} data={selectData} onSelect={this.handleTypeClick}/>
                  <Gallery list={this.state.list}/></div>}
            </div>
          )}
          </div>
        </AMUIReact.Col>
      </AMUIReact.Grid>
    </div>
  }
});

export default React.createClass({
  render() {
    return (
      <div className="am-animation-slide-bottom">
        <SP spid={ this.props.params.spid }/>
      </div>
    );
  }
});
