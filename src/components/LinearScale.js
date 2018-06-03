import React, { Component } from 'react';
import './LinearScale.css';

class LinearScale extends Component {
  componentDidMount() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#4d5665';
    ctx.lineWidth = 1;
    ctx.font = '14px Arial';
    ctx.fillStyle = '#4d5665';
    ctx.textAlign = 'center';
    ctx.fillText('100m', 140, 64);
    ctx.beginPath();
    ctx.moveTo(40, 50);
    ctx.lineTo(40, 70);
    ctx.lineTo(240, 70);
    ctx.lineTo(240, 50);
    ctx.stroke();
  }
  render() {
    return (
      <canvas ref="canvas" className='Canvas' width={280} height={110} />
    );
  }
}

export default LinearScale;