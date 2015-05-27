const React = require('react');

const Logo = require('./logo');
const AppStore = require('../stores/app-store');
const Groupings = require('./groupings.js');
const Status = require('./status.js');
const Topologies = require('./topologies.js');
const WebapiUtils = require('../utils/web-api-utils');
const AppActions = require('../actions/app-actions');
const Details = require('./details');
const Nodes = require('./nodes');
const RouterUtils = require('../utils/router-utils');


const ESC_KEY_CODE = 27;

function getStateFromStores() {
  return {
    currentTopology: AppStore.getCurrentTopology(),
    connectionState: AppStore.getConnectionState(),
    currentGrouping: AppStore.getCurrentGrouping(),
    selectedNodeId: AppStore.getSelectedNodeId(),
    nodeDetails: AppStore.getNodeDetails(),
    nodes: AppStore.getNodes(),
    topologies: AppStore.getTopologies()
  };
}


const App = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    AppStore.on(AppStore.CHANGE_EVENT, this.onChange);
    window.addEventListener('keyup', this.onKeyPress);

    RouterUtils.getRouter().start({hashbang: true});
    WebapiUtils.getTopologies();
  },

  onChange: function() {
    this.setState(getStateFromStores());
  },

  onKeyPress: function(ev) {
    if (ev.keyCode === ESC_KEY_CODE) {
      AppActions.hitEsc();
    }
  },

  render: function() {
    const showingDetails = this.state.selectedNodeId;

    return (
      <div>
        {showingDetails && <Details nodes={this.state.nodes}
          nodeId={this.state.selectedNodeId}
          details={this.state.nodeDetails} /> }

        <div className="header">
          <Logo />
          <Topologies topologies={this.state.topologies} currentTopology={this.state.currentTopology} />
          <Groupings active={this.state.currentGrouping} currentTopology={this.state.currentTopology} />
          <Status connectionState={this.state.connectionState} />
        </div>

        <Nodes nodes={this.state.nodes} />
      </div>
    );
  }

});

module.exports = App;
