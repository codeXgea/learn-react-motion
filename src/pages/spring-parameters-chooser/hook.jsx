import React, { useEffect, useState } from 'react';
import { Motion, spring } from 'react-motion';
import Styles from './index.css';
import classNames from 'classnames';
import { range } from 'lodash';

const gridWidth = 150;
const gridHeight = 150;
const grid = range(4).map(() => range(6));


export default () => {
  const [state, setState] = useState({
    delta: [0, 0],
    mouse: [0, 0],
    isPressed: false,
    firstConfig: [60, 5],
    slider: { dragged: null, num: 0 },
    lastPressed: [0, 0],
  });

  const handleTouchStart = (pos, press, e) => {
    handleMouseDown(pos, press, e.touches[0]);
  };

  const handleMouseDown = (pos, [pressX, pressY], { pageX, pageY }) => {
    setState({
      ...state,
      delta: [pageX - pressX, pageY - pressY],
      mouse: [pressX, pressY],
      isPressed: true,
      lastPressed: pos,
    });
  };

  const handleTouchMove = (e) => {
    if (state.isPressed) {
      e.preventDefault();
    }
    handleMouseMove(e.touches[0]);
  };

  const handleMouseMove = ({ pageX, pageY }) => {
    const { isPressed, delta: [dx, dy] } = state;
    if (isPressed) {
      setState({ ...state,mouse: [pageX - dx, pageY - dy] });
    }
  };

  const handleMouseUp = () => {
    setState({
      ...state,

      isPressed: false,
      delta: [0, 0],
      slider: { dragged: null, num: 0 },
    });
  };

  const handleChange = (constant, num, { target }) => {
    const { firstConfig: [s, d] } = state;
    if (constant === 'stiffness') {
      setState({
        ...state,
        firstConfig: [target.value - num * 30, d],
      });
    } else {
      setState({
        ...state,
        firstConfig: [s, target.value - num * 2],
      });
    }
  };

  const handleMouseDownInput = (constant, num) => {
    setState({
      ...state,
      slider: { dragged: constant, num: num },
    });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    }
  },[handleMouseMove, handleMouseUp, handleTouchMove]);

  const {
    mouse, isPressed, lastPressed, firstConfig: [s0, d0], slider: { dragged, num },
  } = state;

  return (
    <div className={Styles['demo5']}>
      {grid.map((row, i) => {
        return row.map((cell, j) => {
          const cellStyle = {
            top: gridHeight * i,
            left: gridWidth * j,
            width: gridWidth,
            height: gridHeight,
          };
          const stiffness = s0 + i * 30;
          const damping = d0 + j * 2;
          const motionStyle = isPressed
            ? { x: mouse[0], y: mouse[1] }
            : {
              x: spring(gridWidth / 2 - 25, { stiffness, damping }),
              y: spring(gridHeight / 2 - 25, { stiffness, damping }),
            };

          return (
            <div style={cellStyle} className={Styles['demo5-cell']}>
              <input
                type="range"
                min={0}
                max={300}
                value={stiffness}
                onMouseDown={() => handleMouseDownInput('stiffness', i)}
                onChange={(event) => handleChange('stiffness', i,event)}/>
              <input
                type="range"
                min={0}
                max={40}
                value={damping}
                onMouseDown={() => handleMouseDownInput('damping', j)}
                onChange={(event) => handleChange('damping', j,event)}/>
              <Motion style={motionStyle}>
                {({ x, y }) => {
                  let thing;
                  if (dragged === 'stiffness') {
                    thing = i < num ? <div className="demo5-minus">-{(num - i) * 30}</div>
                      : i > num ? <div className="demo5-plus">+{(i - num) * 30}</div>
                        : <div className="demo5-plus">0</div>;
                  } else {
                    thing = j < num ? <div className="demo5-minus">-{(num - j) * 2}</div>
                      : j > num ? <div className="demo5-plus">+{(j - num) * 2}</div>
                        : <div className="demo5-plus">0</div>;
                  }
                  const active = lastPressed[0] === i && lastPressed[1] === j
                    ? 'demo5-ball-active'
                    : '';
                  return (
                    <div
                      style={{
                        transform: `translate3d(${x}px, ${y}px, 0)`,
                        WebkitTransform: `translate3d(${x}px, ${y}px, 0)`,
                      }}
                      className={classNames(Styles['demo5-ball'], Styles[active])}
                      onMouseDown={(event) => handleMouseDown([i, j], [x, y],event)}
                      onTouchStart={(event) => handleTouchStart([i, j], [x, y],event)}>
                      <div className={Styles['demo5-preset']}>
                        {stiffness}{dragged === 'stiffness' && thing}
                      </div>
                      <div className={Styles['demo5-preset']}>
                        {damping}{dragged === 'damping' && thing}
                      </div>
                    </div>
                  );
                }}
              </Motion>
            </div>
          );
        });
      })}
    </div>
  );
}
