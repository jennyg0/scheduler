import { useState } from 'react';

export default function useVisualMode(initial) {
  const[mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(change, replace = false) {
    setMode(change)
    if (!replace) {
      setHistory(prev => [...prev, change])
    } else {
      setHistory(prev => [...prev.slice(0, history.length-1), change])
    }
  }

  function back() {
    if (history.length > 1) {
      setMode(history[history.length-2])
      setHistory(prev => [...prev.slice(0, history.length-1)])
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