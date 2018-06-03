import React, { Component } from 'react';
import Draggable from 'react-draggable';
import Client from './components/Client';
import LinearScale from './components/LinearScale';
import Sidebar from './components/Sidebar';
import apImage from './assets/ap.png'
import * as constants from '../src/constants/constants';
import './App.css';

const calculateReceivePower = (power, fspl, gain) => {
  /* Radio Transmit Power (dBm) – Loss (dB) + Antenna Gain (dBi) = Output Power (dBm) */
  return power - fspl + gain;
}

const calculate_FSPL = (radius, frequency) => {
  /* FSPL[dB] = 20 * log(d[m]) + 20 * log(f[GHz]) + 32.45 */
  return 20 * Math.log10(radius) + 20 * Math.log10(frequency) + 32.45;
}

const calculateDistance = (x1, y1, x2, y2) => {
  /* distance = sqrt( (x2 - x1)^2 + (y2 - y1)^2 ) */
  return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transmitPower: constants.INITIAL_TRANSMIT_POWER,
      radioFrequency: constants.INITIAL_RADIO_FREQUENCY,
      coverageUnitType: constants.INITIAL_COVERAGE_UNIT_TYPE,
      coverageRadius: 0,
      signalRadius: 0,
      clients: [],
      ap: {
        x: 0,
        y: 0
      }
    }
  }
  calculateDistance = (client) => {
    const clientX = client.x;
    const clientY = client.y;
    const apX = this.state.ap.x;
    const apY = this.state.ap.y;
    return calculateDistance(apX, apY, clientX, clientY) / constants.PIXELS_PER_METER;
  }
  generateClientCoordinates = () => {
    const areaWidth = window.innerWidth - constants.SIDEBAR_WIDTH - constants.DOT_DIAMETER;
    const areaHeight = window.innerHeight - constants.DOT_DIAMETER;
    const x = Math.floor(Math.random() * areaWidth) + constants.DOT_DIAMETER / 2;
    const y = Math.floor(Math.random() * areaHeight) + constants.DOT_DIAMETER / 2;
    return { x, y };
  }
  areClientsWithinRange = () => {
    const power = this.state.transmitPower;
    const frequency = this.state.radioFrequency;
    const gain = constants.CLIENT_ANTENNA_GAIN;
    const updatedClients = this.state.clients.map((client) => {
      const distance = this.calculateDistance(client);
      const fspl = calculate_FSPL(distance, frequency);
      const receivePower = calculateReceivePower(power, fspl, gain);
      return {
        ...client,
        withinRange: receivePower > constants.MINIMAL_DEVICE_POWER
      };
    });
    this.setState({
      clients: updatedClients
    });
  }
  generateClients = () => {
    const num = constants.NUMBER_OF_CLIENTS;
    let clients = this.state.clients;
    for (let i = 0; i < num; i++) {
      let coordinates = this.generateClientCoordinates();
      clients.push(coordinates);
    }
    this.setState({
      clients: clients
    }, () => this.areClientsWithinRange());
  }
  updateApCoordinates = () => {
    let ap = this.refs.image.getBoundingClientRect();
    this.setState({
      ap: {
        x: ap.left + 96,
        y: ap.top + 96
      }
    }, () => this.areClientsWithinRange());
  }
  calculateCoverageRadius = () => {
    /* FSPL[dB] = 20 * log(d[m]) + 20 * log(f[GHz]) + 32.45 */
    const frequency = this.state.radioFrequency;
    const radius = Math.pow(10, (constants.BOUNDARY_FSPL - 32.45) / 20) / frequency;
    const roundedRadius = Math.round(radius);
    this.setState({
      coverageRadius: roundedRadius
    }, () => this.updateApCoordinates());
  }
  calculateSignalRadius = () => {
    /* FSPL[dB] = 20 * log(d[m]) + 20 * log(f[GHz]) + 32.45 */
    const power = this.state.transmitPower;
    const fspl = - constants.MINIMAL_DEVICE_POWER + constants.CLIENT_ANTENNA_GAIN + power;
    const frequency = this.state.radioFrequency;
    const radius = Math.pow(10, (fspl - 32.45) / 20) / frequency;
    const roundedRadius = Math.round(radius);
    this.setState({
      signalRadius: roundedRadius
    }, () => this.updateApCoordinates());
  }
  setTransmitParameters = (power, radio, coverage) => {
    console.log(power, radio, coverage)
    this.setState({
      transmitPower: power,
      radioFrequency: radio,
      coverageUnitType: coverage
    }, () => {
      this.calculateCoverageRadius();
      this.calculateSignalRadius();
    });
  }
  onDeviceDrag = (_, { deltaX, deltaY }) => {
    const { x, y } = this.state.ap;
    this.setState({
      ap: {
        x: x + deltaX,
        y: y + deltaY,
      }
    }, () => this.areClientsWithinRange());
  }
  handleImageLoaded = (event) => {
    this.updateApCoordinates();
    this.generateClients();
  }
  handleImageErrored = (event) => {
    this.refs.image.src = apImage;
  }
  updateWindowDimensions = () => {
    this.updateApCoordinates()
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  componentDidMount() {
    this.calculateCoverageRadius();
    this.calculateSignalRadius();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  render() {
    let radius = 0;
    if (this.state.coverageUnitType === "absolute") {
      radius = this.state.signalRadius;
    }
    if (this.state.coverageUnitType === "relative") {
      radius = this.state.coverageRadius;
    }
    return (
      <div>
        <div className="App">
          {this.state.clients.map((client, i) => (
            <Client
              key={i}
              x={client.x}
              y={client.y}
              withinRange={client.withinRange} />
          ))}
          <Draggable onDrag={this.onDeviceDrag}>
            <div
              className="App-coverage" style={{
                width: constants.PIXELS_PER_METER * 2 * radius,
                height: constants.PIXELS_PER_METER * 2 * radius
              }}>
              <img
                className="App-image"
                src={constants.IMAGE_URL}
                ref="image"
                alt="AccessPoint"
                draggable="false"
                onLoad={this.handleImageLoaded}
                onError={this.handleImageErrored} />
            </div>
          </Draggable>
          <LinearScale />
        </div>
        <Sidebar
          transmitPower={this.state.transmitPower}
          radioFrequency={this.state.radioFrequency}
          coverageUnitType={this.state.coverageUnitType}
          setTransmitParameters={this.setTransmitParameters}
        />
      </div>
    );
  }
}

export default App;
