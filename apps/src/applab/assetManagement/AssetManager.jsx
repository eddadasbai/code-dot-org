var React = require('react');
var AssetsApi = require('./clientApi');
var AssetRow = require('./AssetRow.jsx');

var errorMessages = {
  415: 'This type of file is not supported.',
  500: 'The server responded with an error.',
  unknown: 'An unknown error occurred.'
};

function getErrorMessage(status) {
  return errorMessages[status] || errorMessages.unknown;
}

/**
 * A component for managing hosted assets.
 */
module.exports = React.createClass({
  propTypes: {
    assetChosen: React.PropTypes.func,
    typeFilter: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      assets: null,
      statusMessage: ''
    };
  },

  componentWillMount: function () {
    // TODO: Use Dave's client api when it's finished.
    AssetsApi.ajax('GET', '', this.onAssetListReceived, this.onAssetListFailure);
  },

  /**
   * Called after the component mounts, when the server responds with the
   * current list of assets.
   * @param xhr
   */
  onAssetListReceived: function (xhr) {
    var assets = JSON.parse(xhr.responseText);
    if (this.props.typeFilter) {
      assets = assets.filter(function (asset) {
        return asset.category === this.props.typeFilter;
      }.bind(this));
    }
    this.setState({assets: assets});
  },

  /**
   * Called after the component mounts, if the server responds with an error
   * when loading the current list of assets.
   * @param xhr
   */
  onAssetListFailure: function (xhr) {
    this.setState({statusMessage: 'Error loading asset list: ' +
        getErrorMessage(xhr.status)});
  },

  /**
   * We've hidden the <input type="file"/> and replaced it with a big button.
   * Forward clicks on the button to the hidden file input.
   */
  fileUploadClicked: function () {
    var uploader = React.findDOMNode(this.refs.uploader);
    uploader.click();
  },

  /**
   * Uploads the current file selected by the user.
   * TODO: HTML5 File API isn't available in IE9, need a fallback.
   */
  upload: function () {
    var file = React.findDOMNode(this.refs.uploader).files[0];
    if (file.type && this.props.typeFilter) {
      var type = file.type.split('/')[0];
      if (type !== this.props.typeFilter) {
        this.setState({statusMessage: 'Only ' + this.props.typeFilter +
          ' assets can be used here.'});
        return;
      }
    }

    // TODO: Use Dave's client api when it's finished.
    AssetsApi.ajax('PUT', file.name, function (xhr) {
      this.state.assets.push(JSON.parse(xhr.responseText));
      this.setState({statusMessage: 'File "' + file.name +
          '" successfully uploaded!'});
    }.bind(this), function (xhr) {
      this.setState({statusMessage: 'Error uploading file: ' +
          getErrorMessage(xhr.status)});
    }.bind(this), file);

    this.setState({statusMessage: 'Uploading...'});
  },

  deleteAssetRow: function (name) {
    this.setState({
      assets: this.state.assets.filter(function (asset) {
        return asset.filename !== name;
      })
    });
    this.setState({statusMessage: 'File "' + name + '" successfully deleted!'});
  },

  render: function () {
    var assetList;
    // If `this.state.assets` is null, the asset list is still loading. If it's
    // empty, the asset list has loaded and there are no assets in the current
    // channel (matching the `typeFilter`, if one was provided).
    if (this.state.assets === null) {
      assetList = (
        <div style={{margin: '1em 0', textAlign: 'center'}}>
          <i className="fa fa-spinner fa-spin" style={{fontSize: '32px'}}></i>
        </div>
      )
    } else if (this.state.assets.length === 0) {
      assetList = (
        <div style={{margin: '1em 0'}}>
          Your assets will appear here. Click "Upload File" to add a new asset
          for this project.
        </div>
      );
    } else {
      assetList = (
        <div style={{maxHeight: '330px', overflow: 'scroll', margin: '1em 0'}}>
          <table style={{width: '100%'}}>
            <tbody>
              {this.state.assets.map(function (asset) {
                var path = AssetsApi.basePath(asset.filename);
                var choose = this.props.assetChosen &&
                    this.props.assetChosen.bind(this, path);

                return <AssetRow
                    key={asset.filename}
                    name={asset.filename}
                    type={asset.category}
                    size={asset.size}
                    onChoose={choose}
                    onDelete={this.deleteAssetRow.bind(this, asset.filename)} />;
              }.bind(this))}
            </tbody>
          </table>
        </div>
      );
    }

    var title = this.props.assetChosen ?
        <p className="dialog-title">Choose Assets</p> :
        <p className="dialog-title">Manage Asset</p>;
    var accept = (this.props.typeFilter || '*') + '/*';

    return (
      <div className="modal-content" style={{margin: 0}}>
        {title}
        {assetList}
        <input
            ref="uploader"
            type="file"
            accept={accept}
            style={{display: 'none'}}
            onChange={this.upload} />
        <button onClick={this.fileUploadClicked} className="share">
          <i className="fa fa-upload"></i>
          &nbsp;Upload File
        </button>
        <span style={{margin: '0 10px'}}>
          {this.state.statusMessage}
        </span>
      </div>
    );
  }
});
