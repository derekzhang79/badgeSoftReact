import React from "react";
import {Link} from 'react-router';
import axios from "axios";

export default class CardEditor extends React.Component {
  constructor(props) {
    super();
    this.state = {
      columns: '',
      designid:'',
      designs:[]
    }

  this.changeDesign.bind(this);
  // this.populateSelect.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    console.log('Card Design Saved');
    event.preventDefault();
  }

//   populateSelect(event) {
//   console.log("Attemptimg to populate select");
//   let designs = this.state.designs;
//   console.log("designs in state are: ",designs);
//   var select =event;
//   console.log("Event that triggered this function is ",select);
//   // for (var i = 0; i<=designs.length ; i++) {
//   //     var opt = document.createElement('option');
//   //     opt.value = i.designid;
//   //     opt.innerHTML = i.designid;
//   //     select.appendChild(opt);
//   //   }
// }

changeDesign(event) {
  console.log("A design has been chosen. Here is the event");
  console.log(event.target.value);
  this.setState({designid: event.target.value});
  }


  render() {
    //   console.log("about to fetch columns");
    //   console.log(this.props.user);
    var connection = JSON.parse(this.props.user.connection);
    var data = {
      client: this.props.user.dbclient,
      dbtable: this.props.user.dbtable,
      connection: connection,
      userid:this.props.user.id
    };
    var design='';
    var self = this;
    var userid = this.props.user.id;
    var designid = 0;
    if(this.state.designs.length===0) {
    axios.post('/getColumns', {data: data})
      .then(function (response) {
        var columns = Object.keys(response.data.message);
        var designs = response.data.designs;
        console.log("Designs received from callback",designs);
        if (self.state.designs[0]) {
            if (self.state.columns) {
            // var columnarr = JSON.stringify(self.state.columns);
                console.log("Columns and design already in state ");
                console.log("columns are",self.state.columns);
                console.log("designs are",self.state.designs);
                console.log(designid);
            } else {
                self.setState({columns:columns});
            }
        } else {
            console.log("self.state.designs[0] false, skipped to 79");
            if (designs[0]) {
                console.log("Designs defined as",designs);
                console.log("Columns defined as",columns);
                self.setState({columns: columns, designs:designs});
            } else {
              console.log("setting custom empty design here");
              designs = [{designid:1,design:'{"objects":[]}'}];
              self.setState({designs: designs});
      }
        }
        console.log("all conditionals done. Skipped to 88");
        console.log("setting state to response from callback");
        console.log("designs to be set are",designs);
        console.log("columns to be set are",columns);
        self.setState({columns: columns, designs: designs});
        // console.log('/kitchen/kitchensink.html?columns=',JSON.stringify(self.state.columns),'&userid=',userid,'&designid',designid,'&design=',design);
    });
}
    if (self.state.designid) {
    var options = [];
    var design='';
    var designid=self.state.designid;
      for (var i = 0; i < this.state.designs.length; i++) {
        options.push(<option value={this.state.designs[i].designid} key={i}>{this.state.designs[i].designid}</option>);
        if (this.state.designid == this.state.designs[i].designid) {
            design = this.state.designs[i].design;
            console.log(design);
        }
      }

    return (
      <div>
      <select id="designPicker"  onChange={this.changeDesign.bind(this)} >
        <option value="">Select a Design to Edit</option>
        <option value='1'>Create New</option>
        {options}
      </select>
        <iframe id="kitchensinkiframe" className="kitchensink" src={'/kitchen/kitchensink.html?columns=' + JSON.stringify(self.state.columns) + '&userid=' + userid + '&designid=' + designid + '&design=' + design }/>

      </div>
  );} else {
      var options = [];
        for (var i = 1; i < this.state.designs.length; i++) {
          options.push(<option value={this.state.designs[i].designid} key={i}>{this.state.designs[i].designid}</option>);
        }
      return(
          <div className="row">
            <div id="profile" className="col-xs-8 col-xs-offset-2">
            <select id="designPicker"  onChange={this.changeDesign.bind(this)} >
              <option value="">Select a Design to Edit</option>
              <option value='1'>Create New</option>
              {options}
            </select>
            </div>
          </div>
      )
  }
  };
};
