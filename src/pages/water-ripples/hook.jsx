import React,{useState} from 'react';
import {TransitionMotion, spring} from 'react-motion';
import Styles from "./index.css";
const leavingSpringConfig = {stiffness: 60, damping: 15};


export default () => {
  const [state, setState] = useState({mouse: [], now: 't' + 0});


  const handleMouseMove = ({pageX, pageY}) => {
    // Make sure the state is queued and not batched.
    setState(() => {
      return {
        ...state,
        mouse: [pageX - 25, pageY - 25],
        now: 't' + Date.now(),
      };
    });
  };

  const handleTouchMove = (e) => {
    console.log(e);
    e.preventDefault();
    handleMouseMove(e.touches[0]);
  };

  const willLeave = (styleCell) => {
    return {
      ...styleCell.style,
      opacity: spring(0, leavingSpringConfig),
      scale: spring(2, leavingSpringConfig),
    };
  };

  const {mouse: [mouseX, mouseY], now} = state;
  const styles = mouseX == null ? [] : [{
    key: now,
    style: {
      opacity: spring(1),
      scale: spring(0),
      x: spring(mouseX),
      y: spring(mouseY),
    }
  }];
  return (
    <TransitionMotion willLeave={willLeave} styles={styles}>
      {circles =>
        <div
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className={Styles['demo7']}>
          {circles.map(({key, style: {opacity, scale, x, y}}) =>
            <div
              key={key}
              className={Styles['demo7-ball']}
              style={{
                opacity: opacity,
                scale: scale,
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                WebkitTransform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
              }} />
          )}
        </div>
      }
    </TransitionMotion>
  );

}
