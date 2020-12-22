import React, { useState } from 'react';
import { TransitionMotion, spring, presets } from 'react-motion';
import Styles from './index.css';


export default () => {


  const [state, setState] = useState({
    todos: [
      // key is creation date
      { key: 't1', data: { text: 'Board the plane', isDone: false } },
      { key: 't2', data: { text: 'Sleep', isDone: false } },
      { key: 't3', data: { text: 'Try to finish conference slides', isDone: false } },
      { key: 't4', data: { text: 'Eat cheese and drink wine', isDone: false } },
      { key: 't5', data: { text: 'Go around in Uber', isDone: false } },
      { key: 't6', data: { text: 'Talk with conf attendees', isDone: false } },
      { key: 't7', data: { text: 'Show Demo 1', isDone: false } },
      { key: 't8', data: { text: 'Show Demo 2', isDone: false } },
      { key: 't9', data: { text: 'Lament about the state of animation', isDone: false } },
      { key: 't10', data: { text: 'Show Secret Demo', isDone: false } },
      { key: 't11', data: { text: 'Go home', isDone: false } },
    ],
    value: '',
    selected: 'all',
  });


  const handleChange = ({ target: { value } }) => {
    setState({ ...state, value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      key: 't' + Date.now(),
      data: { text: state.value, isDone: false },
    };
    // append at head
    setState({ ...state, todos: [newItem].concat(state.todos) });
  };

  const handleDone = (doneKey) => {
    setState({
      ...state,
      todos: state.todos.map(todo => {
        const { key, data: { text, isDone } } = todo;
        return key === doneKey
          ? { key: key, data: { text: text, isDone: !isDone } }
          : todo;
      }),
    });
  };

  const handleToggleAll = () => {
    const allNotDone = state.todos.every(({ data }) => data.isDone);
    setState({
      ...state,
      todos: state.todos.map(({ key, data: { text, isDone } }) => (
        { key: key, data: { text: text, isDone: !allNotDone } }
      )),
    });
  };

  const handleSelect = (selected) => {
    setState({ ...state, selected });
  };

  const handleClearCompleted = () => {
    setState({ ...state, todos: state.todos.filter(({ data }) => !data.isDone) });
  };

  const handleDestroy = (date) => {
    setState({ ...state, todos: state.todos.filter(({ key }) => key !== date) });
  };

  // actual animation-related logic
  const getDefaultStyles = () => {
    return state.todos.map(todo => ({ ...todo, style: { height: 0, opacity: 1 } }));
  };

  const getStyles = () => {
    const { todos, value, selected } = state;
    return todos.filter(({ data: { isDone, text } }) => {
      return text.toUpperCase().indexOf(value.toUpperCase()) >= 0 &&
        (selected === 'completed' && isDone ||
          selected === 'active' && !isDone ||
          selected === 'all');
    })
      .map((todo, i) => {
        return {
          ...todo,
          style: {
            height: spring(60, presets.gentle),
            opacity: spring(1, presets.gentle),
          },
        };
      });
  };

  const willEnter = () => {
    return {
      height: 0,
      opacity: 1,
    };
  };

  const willLeave = () => {
    return {
      height: spring(0),
      opacity: spring(0),
    };
  };

  const { todos, value, selected } = state;
  const itemsLeft = todos.filter(({ data: { isDone } }) => !isDone).length;

  return (
    <section className={Styles['todoapp']}>
      <header className={Styles['header']}>
        <h1>todos</h1>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus={true}
            className={Styles['new-todo']}
            placeholder="What needs to be done?"
            value={value}
            onChange={handleChange}
          />
        </form>
      </header>
      <section className={Styles['main']}>
        <input
          className={Styles['toggle-all']}
          type="checkbox"
          checked={itemsLeft === 0} style={{ display: todos.length === 0 ? 'none' : 'inline' }}
          onChange={handleToggleAll}/>
        <TransitionMotion
          defaultStyles={getDefaultStyles()}
          styles={getStyles()}
          willLeave={willLeave}
          willEnter={willEnter}>
          {styles =>
            <ul className={Styles['todo-list']}>
              {styles.map(({ key, style, data: { isDone, text } }) =>
                <li key={key} style={style} className={isDone ? Styles.completed : ''}>
                  <div className={Styles['view']}>
                    <input
                      className={Styles['toggle']}
                      type="checkbox"
                      onChange={() => handleDone(key)}
                      checked={isDone}
                    />
                    <label>{text}</label>
                    <button
                      className={Styles['destroy']}
                      onClick={() => handleDestroy(key)}
                    />
                  </div>
                </li>,
              )}
            </ul>
          }
        </TransitionMotion>
      </section>
      <footer className={Styles.footer}>
          <span className={Styles['todo-count']}>
            <strong>
              {itemsLeft}
            </strong> {itemsLeft === 1 ? 'item' : 'items'} left
          </span>
        <ul className={Styles.filters}>
          <li>
            <a
              className={selected === 'all' ? Styles.selected : ''}
              onClick={() => handleSelect('all')}>
              All
            </a>
          </li>
          <li>
            <a
              className={selected === 'active' ? Styles.selected : ''}
              onClick={() => handleSelect('active')}>
              Active
            </a>
          </li>
          <li>
            <a
              className={selected === 'completed' ? Styles.selected : ''}
              onClick={() => handleSelect('completed')}>
              Completed
            </a>
          </li>
        </ul>
        <button className={Styles['clear-completed']} onClick={handleClearCompleted}>
          Clear completed
        </button>
      </footer>
    </section>
  );
}
