import React from 'react';
import PropTypes from 'prop-types';
import * as constants from '../constants/constants';
import './Client.css';

const client = (props) => {
  const style = {
    left: props.x - constants.DOT_DIAMETER / 2,
    top: props.y - constants.DOT_DIAMETER / 2,
    backgroundColor: props.withinRange ? '#56bc8a' : '#d95e40'
  }
  return (
    <span className='Client-dot' style={style}></span>
  );
}

client.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  withinRange: PropTypes.bool
}

export default client;
