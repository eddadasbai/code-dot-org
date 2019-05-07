import PropTypes from 'prop-types';
import React from 'react';
import color from '../../util/color';
import i18n from '@cdo/locale';
import DatasetListEntry from './DatasetListEntry';
import FirebaseStorage from '../../storage/firebaseStorage';
import datasetLibrary from '../datasetLibrary.json';

const styles = {
  root: {
    margin: '0 0 0 5px'
  },
  divider: {
    borderColor: color.purple,
    margin: '5px 0'
  }
};

/**
 * A component for managing access to Code.org hosted datasets
 */
export default class DatasetPicker extends React.Component {
  static propTypes = {
    assetChosen: PropTypes.func
  };

  importCsvFromUrl = (name, url) => {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'text';
    request.onload = function() {
      FirebaseStorage.importCsv(
        name,
        request.response,
        () => console.log('importCsv onSuccess'),
        () => console.log('importCsv onError')
      );
      console.log(request.status);
    };
    request.onerror = function() {
      console.log('onerror');
    };
    request.send();
  };

  chooseAsset = (name, url) => {
    FirebaseStorage.createTable(
      name,
      () => console.log('createTable onSuccess'),
      () => console.log('createTable onError')
    );
    this.importCsvFromUrl(name, url);
    this.props.assetChosen(name);
  };

  render() {
    const datasetEntries = datasetLibrary.datasets.map(d => {
      const choose = this.chooseAsset.bind(this, d.name, d.url);
      return (
        <DatasetListEntry
          key={d.name}
          name={d.name}
          description={d.description}
          url={d.url}
          onChoose={choose}
        />
      );
    });

    return (
      <div className="modal-content" style={styles.root}>
        <p>{i18n.chooseDataset()}</p>
        <hr style={styles.divider} />
        <table>
          <tbody>{datasetEntries}</tbody>
        </table>
      </div>
    );
  }
}
