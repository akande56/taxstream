/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

// !Don't convert this functions to arrow functions.
// !I use func expression of the hoisting with func expression

// TODO find a way to clean this mess.
// This is not the best way to it but it works for noe

export function State<T = any>(initialState: T) {
  const [value, setState] = useState<T>(initialState);

  return {
    get value() {
      return value;
    },
    set value(newValue: any) {
      setState(newValue);
    },
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppState<T = any>(initialState: T) {
  const reference = useRef(initialState);
  const [{ value, cb }, setState] = useState<{
    value: T;
    cb?: (value: T) => void;
  }>({ value: initialState });
  const [prevState, setPrevState] = useState<T>(initialState);

  const stateReference = () => reference.current || value;

  const updateState = (
    newValue: { [key: string]: any },
    cb?: (value: T) => void
  ) => {
    setPrevState(value);

    const val = {
      ...reference.current,
      ...newValue,
    };

    setState({
      value: val,
      cb,
    });
    reference.current = val;
  };

  const defaultState = () => {
    setState({
      cb: undefined,
      value: initialState,
    });

    reference.current = initialState;
  };

  useEffect(
    function () {
      if (cb) {
        cb(value);
      }
    },
    [cb, value]
  );

  return {
    prevState,
    updateState,
    defaultState,
    state: value,
    stateReference,
  };
}
