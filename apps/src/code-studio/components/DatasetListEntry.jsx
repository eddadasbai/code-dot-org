import React from 'react';
import PropTypes from 'prop-types';
import i18n from '@cdo/locale';
import * as color from '../../util/color';

const styles = {
  datasetNameText: {
    fontSize: 'large',
    color: color.purple,
    font: 'Gotham 5r',
    paddingRight: 5,
    cursor: 'pointer'
  }
};

/**
 * Component for a single dataset in the Dataset Picker
 * Used in App Lab
 */
export default class DatasetListEntry extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
    onChoose: PropTypes.func
  };

  render() {
    return (
      <tr>
        <td width="200" style={styles.datasetNameText}>
          {this.props.name}
        </td>
        <td width="450">{this.props.description}</td>
        <td width="200" style={{textAlign: 'right'}}>
          <button type="button" onClick={this.props.onChoose}>
            {i18n.choose()}
          </button>
        </td>
      </tr>
    );
  }
}
