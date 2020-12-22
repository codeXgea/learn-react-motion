import React,{useState} from 'react';
import {Motion, spring} from 'react-motion';
import Styles from './style.css';


export default () => {
  const [state, setState] = useState({open: false});

  const handleMouseDown = () => {
    setState({open: !state.open});
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    handleMouseDown();
  };

  return (
    <div>
      <button
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}>
        Toggle
      </button>

      <Motion style={{x: spring(state.open ? 400 : 0)}}>
        {({x}) =>
          // children is a callback which should accept the current value of
          // `style`
          <div className={Styles['demo0']}>
            <div className={Styles['demo0-block']} style={{
              WebkitTransform: `translate3d(${x}px, 0, 0)`,
              transform: `translate3d(${x}px, 0, 0)`,
            }} />
          </div>
        }
      </Motion>
    </div>
  );
}
