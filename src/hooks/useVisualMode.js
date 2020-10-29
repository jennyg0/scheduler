import { useState } from 'react';

export default function useVisualMode(initial) {
  const[mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(change, replace = false) {
    if (!replace) {
      setMode(change)
      history.push(change)
    } else {
      history[history.length-1] = change
      setMode(change)
    }
  }

  function back(){
    if (history.length > 1) {
      history.pop()
      setMode(history[history.length-1])
    } else {
      setMode(history[0])
    }
  }

  return {
    mode,
    transition, 
    back
  };
}