import React, { useState } from 'react';
import { Motion, spring } from 'react-motion';
import Styles from './index.css';


const springSettings = { stiffness: 170, damping: 26 };
const NEXT = 'show-next';


export default () => {
  const [state, setState] = useState({
    photos: [[500, 350], [800, 600], [800, 400], [700, 500], [200, 650], [600, 600]],
    currPhoto: 0,
  });

  const handleChange = ({ target: { value } }) => {
    setState({
      ...state,
      currPhoto: value,
    });
  };

  const clickHandler = (btn) => {
    let photoIndex = btn === NEXT ? state.currPhoto + 1 : state.currPhoto - 1;

    photoIndex = photoIndex >= 0 ? photoIndex : state.photos.length - 1;
    photoIndex = photoIndex >= state.photos.length ? 0 : photoIndex;

    setState({
      ...state,
      currPhoto: photoIndex,
    });
  };

  const { photos, currPhoto } = state;
  const [currWidth, currHeight] = photos[currPhoto];

  const widths = photos.map(([origW, origH]) => currHeight / origH * origW);

  const leftStartCoords = widths
    .slice(0, currPhoto)
    .reduce((sum, width) => sum - width, 0);

  let configs = [];
  photos.reduce((prevLeft, [origW, origH], i) => {
    configs.push({
      left: spring(prevLeft, springSettings),
      height: spring(currHeight, springSettings),
      width: spring(widths[i], springSettings),
    });
    return prevLeft + widths[i];
  }, leftStartCoords);

  return (
    <div>
      <div>Scroll Me</div>
      <button onClick={() => clickHandler('')}>Previous</button>
      <input
        type="range"
        min={0}
        max={photos.length - 1}
        value={currPhoto}
        onChange={handleChange}/>
      <button onClick={() => clickHandler(NEXT)}>Next</button>
      <div className={Styles['demo4']}>
        <Motion style={{ height: spring(currHeight), width: spring(currWidth) }}>
          {container =>
            <div className={Styles['demo4-inner']} style={container}>
              {configs.map((style, i) =>
                <Motion key={i} style={style}>
                  {style =>
                    <img className={Styles['demo4-photo']} src={require(`./images/${i}.jpg`)} style={style}/>
                  }
                </Motion>,
              )}
            </div>
          }
        </Motion>
      </div>
    </div>
  );

}
