import React, { useEffect, useState } from 'react';
import { Motion, spring } from 'react-motion';
import { range } from 'lodash';
import Styles from './index.css';


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

const springConfig = { stiffness: 300, damping: 50 };
const itemsCount = 4;

export default () => {
  const [state, setState] = useState({
    topDeltaY: 0,
    mouseY: 0,
    isPressed: false,
    originalPosOfLastPressed: 0,
    order: range(itemsCount),
  });

  const handleTouchStart = (key, pressLocation, e) => {
    handleMouseDown(key, pressLocation, e.touches[0]);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    handleMouseMove(e.touches[0]);
  };

  const handleMouseDown = (pos, pressY, { pageY }) => {
    setState({
      ...state,
      topDeltaY: pageY - pressY,
      mouseY: pressY,
      isPressed: true,
      originalPosOfLastPressed: pos,
    });
  };

  const handleMouseMove = ({ pageY }) => {
    const { isPressed, topDeltaY, order, originalPosOfLastPressed } = state;

    if (isPressed) {
      const mouseY = pageY - topDeltaY;
      const currentRow = clamp(Math.round(mouseY / 100), 0, itemsCount - 1);
      let newOrder = order;

      if (currentRow !== order.indexOf(originalPosOfLastPressed)) {
        newOrder = reinsert(order, order.indexOf(originalPosOfLastPressed), currentRow);
      }

      setState({ ...state, mouseY: mouseY, order: newOrder });
    }
  };

  const handleMouseUp = () => {
    setState({ ...state, isPressed: false, topDeltaY: 0 });
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
  }, []);

  const { mouseY, isPressed, originalPosOfLastPressed, order } = state;

  return (
    <div className={Styles['demo8']}>
      {range(itemsCount).map(i => {
        const style = originalPosOfLastPressed === i && isPressed
          ? {
            scale: spring(1.1, springConfig),
            shadow: spring(16, springConfig),
            y: mouseY,
          }
          : {
            scale: spring(1, springConfig),
            shadow: spring(1, springConfig),
            y: spring(order.indexOf(i) * 100, springConfig),
          };
        return (
          <Motion style={style} key={i}>
            {({ scale, shadow, y }) =>
              <div
                onMouseDown={(event) => handleMouseDown(i, y, event)}
                onTouchStart={(event) => handleTouchStart(i, y, event)}
                className={Styles['demo8-item']}
                style={{
                  boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                  transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                  WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                  zIndex: i === originalPosOfLastPressed ? 99 : i,
                }}>
                {order.indexOf(i) + 1}
              </div>
            }
          </Motion>
        );
      })}
    </div>
  );

}
