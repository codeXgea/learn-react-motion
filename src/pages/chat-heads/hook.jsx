import React, { useState, useEffect } from 'react';
import { StaggeredMotion, spring, presets } from 'react-motion/lib/react-motion';
import { range } from 'lodash';
import classNames from 'classnames';


import Styles from './index.css';

export default () => {


  const [state, setState] = useState({ x: 250, y: 300 });


  const handleMouseMove = ({ pageX: x, pageY: y }) => setState({ x, y });

  const handleTouchMove = ({ touches }) => this.handleMouseMove(touches[0]);


  useEffect(() => {

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const getStyles = (prevStyles) => {
    // `prevStyles` is the interpolated value of the last tick
    return prevStyles.map((_, i) => {
      return i === 0
        ? state
        : {
          x: spring(prevStyles[i - 1].x, presets.gentle),
          y: spring(prevStyles[i - 1].y, presets.gentle),
        };
    });
  };


  return (
    <StaggeredMotion
      defaultStyles={range(6).map(() => ({ x: 0, y: 0 }))}
      styles={getStyles}>
      {balls =>
        <div className={Styles['demo1']}>
          {balls.map(({ x, y }, i) =>
            <div
              key={i}
              className={classNames(Styles['demo1-ball'], Styles[`ball-${i}`])}
              style={{
                WebkitTransform: `translate3d(${x - 25}px, ${y - 25}px, 0)`,
                transform: `translate3d(${x - 25}px, ${y - 25}px, 0)`,
                zIndex: balls.length - i,
              }}/>,
          )}
        </div>
      }
    </StaggeredMotion>
  );
}
