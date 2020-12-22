import React from 'react';
import {StaggeredMotion, spring, presets} from 'react-motion';
import range from 'lodash.range';
import classNames from 'classnames';
import Styles from './index.css';

export default class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {x: 250, y: 300};
  };

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', this.handleTouchMove);
  };

  handleMouseMove = ({pageX: x, pageY: y}) => {
    this.setState({x, y});
  };

  handleTouchMove = ({touches}) => {
    console.log(touches);
    this.handleMouseMove(touches[0]);
  };

  getStyles = (prevStyles) => {
    // `prevStyles` is the interpolated value of the last tick
    const endValue = prevStyles.map((_, i) => {
      return i === 0
        ? this.state
        : {
          x: spring(prevStyles[i - 1].x, presets.gentle),
          y: spring(prevStyles[i - 1].y, presets.gentle),
        };
    });
    return endValue;
  };

  render() {
    return (
      <StaggeredMotion
        defaultStyles={range(6).map(() => ({x: 0, y: 0}))}
        styles={this.getStyles}>
        {balls =>
          <div className={Styles['demo1']}>
            {balls.map(({x, y}, i) =>
              <div
                key={i}
                className={classNames(Styles['demo1-ball'],Styles[`ball-${i}`])}
                style={{
                  WebkitTransform: `translate3d(${x - 25}px, ${y - 25}px, 0)`,
                  transform: `translate3d(${x - 25}px, ${y - 25}px, 0)`,
                  zIndex: balls.length - i,
                }} />
            )}
          </div>
        }
      </StaggeredMotion>
    );
  };
}
