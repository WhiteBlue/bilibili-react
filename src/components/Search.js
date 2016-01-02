import React from 'react';
import AMUIReact from 'amazeui-react';


export default React.createClass({
  handleSubmit: function (e) {
    e.preventDefault();
    var value = document.getElementById('search_content').value;
    alert(value);
  },
  render: function () {
    var btnSearch = (<AMUIReact.Button type='submit'><AMUIReact.Icon icon="search"/></AMUIReact.Button>);
    return <AMUIReact.Grid>
      <AMUIReact.Col md={8} mdOffset={2}>
        <AMUIReact.Form onSubmit={this.handleSubmit} id="search-form">
          <AMUIReact.Input placeholder="要搜索的内容" id='search_content' btnAfter={btnSearch}/></AMUIReact.Form>
      </AMUIReact.Col>
    </AMUIReact.Grid>;
  }
});
