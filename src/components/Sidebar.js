import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      power: this.props.transmitPower,
      frequency: this.props.radioFrequency,
      coverage: this.props.coverageUnitType
    }
  }
  onSelectChange = (event) => {
    const parsedPower = parseInt(event.target.value, 10);
    this.setState({
      power: parsedPower
    });
  }
  onRadioInputChange = (event) => {
    const parsedFrequency = parseFloat(event.target.value);
    this.setState({
      frequency: parsedFrequency
    });
  }
  onCoverageInputChange = (event) => {
    this.setState({
      coverage: event.target.value
    });
  }
  onSettingsSubmitted = () => {
    this.props.setTransmitParameters(this.state.power, this.state.frequency, this.state.coverage)
  }
  onSettingsCanceled = () => {
    this.setState({
      power: this.props.transmitPower,
      frequency: this.props.radioFrequency,
      coverage: this.props.coverageUnitType
    });
  }
  render() {
    console.log('coverage', this.state.coverage)
    return (
      <div className="Sidebar">
        <p className="Sidebar-header">TX Power</p>
        <select className="Sidebar-select" value={this.state.power} onChange={this.onSelectChange}>
          <option className="Sidebar-option" value={4}>High (4dBm)</option>
          <option className="Sidebar-option" value={-6}>Medium (-6dBm)</option>
          <option className="Sidebar-option" value={-16}>Low (-16dBm)</option>
        </select>
        <p className="Sidebar-header">Radio</p>
        <label className="Sidebar-container">2.4 GHz
          <input
            type="radio"
            name="radio"
            value={2.4}
            checked={this.state.frequency === 2.4}
            onChange={this.onRadioInputChange} />
          <span className="Sidebar-checkmark"></span>
        </label>
        <label className="Sidebar-container">5 GHz
          <input
            type="radio"
            name="radio"
            value={5}
            checked={this.state.frequency === 5}
            onChange={this.onRadioInputChange} />
          <span className="Sidebar-checkmark"></span>
        </label>
        <p className="Sidebar-header">Coverage</p>
        <label className="Sidebar-container">Absolute (-80dBm)
          <input
            type="radio"
            name="coverage"
            value="absolute"
            checked={this.state.coverage === "absolute"}
            onChange={this.onCoverageInputChange} />
          <span className="Sidebar-checkmark"></span>
        </label>
        <label className="Sidebar-container">Relative (-80dB)
          <input
            type="radio"
            name="coverage"
            value="relative"
            checked={this.state.coverage === "relative"}
            onChange={this.onCoverageInputChange} />
          <span className="Sidebar-checkmark"></span>
        </label>
        <hr className="Sidebar-hr" />
        <button className="Sidebar-button" onClick={this.onSettingsSubmitted}>SAVE</button>
        <button className="Sidebar-button-inverse" onClick={this.onSettingsCanceled}>CANCEL</button>
      </div>
    );
  }
}

Sidebar.propTypes = {
  transmitPower: PropTypes.oneOf([4, -6, -16]),
  radioFrequency: PropTypes.oneOf([2.4, 5]),
  coverageUnitType: PropTypes.oneOf(["absolute", "relative"]),
  setTransmitParameters: PropTypes.func
}

export default Sidebar;