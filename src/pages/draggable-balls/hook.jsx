import React, { useState, useEffect } from 'react';
import { Motion, spring } from 'react-motion/lib/react-motion';
import { range } from 'lodash';

import Styles from './index.css';

const springSetting1 = { stiffness: 180, damping: 10 };
const springSetting2 = { stiffness: 120, damping: 17 };

function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const allColors = [
  '#EF767A', '#456990', '#49BEAA', '#49DCB1', '#EEB868', '#EF767A', '#456990',
  '#49BEAA', '#49DCB1', '#EEB868', '#EF767A',
];
const [count, width, height] = [11, 70, 90];
// indexed by visual position
const layout = range(count).map(n => {
  const row = Math.floor(n / 3);
  const col = n % 3;
  return [width * col, height * row];
});


export default () => {

  const [state, setState] = useState({
    mouseXY: [0, 0],
    mouseCircleDelta: [0, 0], // difference between mouse and circle pos for x + y coords, for dragging
    lastPress: null, // key of the last pressed component
    isPressed: false,
    order: range(count), // index: visual position. value: component key/id
  });

  const handleMouseDown = (key, [pressX, pressY], { pageX, pageY }) => {
    setState({
      ...state,
      lastPress: key,
      isPressed: true,
      mouseCircleDelta: [pageX - pressX, pageY - pressY],
      mouseXY: [pressX, pressY],
    });
  };

  const handleTouchStart = (key, pressLocation, e) => {
    handleMouseDown(key, pressLocation, e.touches[0]);
  };


  const handleMouseMove = ({ pageX, pageY }) => {
    const { order, lastPress, isPressed, mouseCircleDelta: [dx, dy] } = state;
    if (isPressed) {
      const mouseXY = [pageX - dx, pageY - dy];
      const col = clamp(Math.floor(mouseXY[0] / width), 0, 2);
      const row = clamp(Math.floor(mouseXY[1] / height), 0, Math.floor(count / 3));
      const index = row * 3 + col;
      const newOrder = reinsert(order, order.indexOf(lastPress), index);
      setState({
        ...state,
        mouseXY,
        order: newOrder,
      });
    }
  };


  const handleTouchMove = (e) => {
    e.preventDefault();
    handleMouseMove(e.touches[0]);
  };


  const handleMouseUp = () => {
    setState({
      ...state,
      isPressed: false,
      mouseCircleDelta: [0, 0],
    });
  };

  useEffect(() => {

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove]);

  const {order, lastPress, isPressed, mouseXY} = state;
  return (
    <div className={Styles['demo2']}>
      {order.map((_, key) => {
        let style;
        let x;
        let y;
        const visualPosition = order.indexOf(key);
        if (key === lastPress && isPressed) {
          [x, y] = mouseXY;
          style = {
            translateX: x,
            translateY: y,
            scale: spring(1.2, springSetting1),
            boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1),
          };
        } else {
          [x, y] = layout[visualPosition];
          style = {
            translateX: spring(x, springSetting2),
            translateY: spring(y, springSetting2),
            scale: spring(1, springSetting1),
            boxShadow: spring((x - (3 * width - 50) / 2) / 15, springSetting1),
          };
        }
        return (
          <Motion key={key} style={style}>
            {({translateX, translateY, scale, boxShadow}) =>
              <div
                onMouseDown={(event) => handleMouseDown( key, [x, y],event)}
                onTouchStart={(event) =>handleTouchStart( key, [x, y],event)}
                className={Styles['demo2-ball']}
                style={{
                  backgroundColor: allColors[key],
                  WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                  transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                  zIndex: key === lastPress ? 99 : visualPosition,
                  boxShadow: `${boxShadow}px 5px 5px rgba(0,0,0,0.5)`,
                }}
              />
            }
          </Motion>
        );
      })}
    </div>
  );
}
