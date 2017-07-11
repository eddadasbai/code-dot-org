import React, {Component, PropTypes} from 'react';
import styleConstants from '../../styleConstants';

const style = {
  root: {
    width: styleConstants['pegasus-content-width'],
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  }
};

/** Uses flexbox to arrange content cards into nice rows with wrapping. */
export default class CardContainer extends Component {
  static propTypes = {
    children: PropTypes.any,
  };

  render() {
    return (
      <div style={style.root}>
        {this.props.children}
      </div>
    );
  }
}
