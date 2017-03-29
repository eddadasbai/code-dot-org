import React, { PropTypes } from 'react';
import color from "@cdo/apps/util/color";

const styles = {
  main: {
    fontSize: 16,
    backgroundColor: color.teal,
    color: color.white,
    padding: '12px 15px',
    marginBottom: 0,
  },
  linesOfCode: {
    fontSize: 16,
    float: 'right'
  }
};

const MiniViewTopRow = React.createClass({
  propTypes: {
    linesOfCode: PropTypes.number.isRequired,
  },

  render() {
    // TODO - i18n
    const { linesOfCode } = this.props;
    return (
      <div style={styles.main}>
        <span>View Unit Overview</span>
        <span style={styles.linesOfCode}>
          Total lines of code: {linesOfCode}
        </span>
      </div>
    );
  }
});

export default MiniViewTopRow;
