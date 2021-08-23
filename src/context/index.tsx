/* eslint-disable no-unused-vars */
import React, { createContext, useReducer, useContext } from 'react';
import reducer from './reducers';

type Schedule = {
  day: string;
  list: string[];
}

type User = {
  _id: string;
  name: string;
  email: string;
  team?: string[];
  lastname: string;
  schedule: Schedule[];
  meetings: {
    day: string;
    list: {
      time: string;
      user: string;
    }[];
  }[];
}

type ContextInterface = {
  user?: User;
  meetings?: Schedule[];
  theme?: 'light' | 'dark';
  dispatch: React.Dispatch<any>;
  team?: {
    name: string;
    manager: User;
    members: User[];
    meetings: Schedule[];
  };
}

export const Context = createContext<ContextInterface>({
  theme: 'light',
  dispatch: () => {},
});

export const Provider = ({ children, initialState = {} }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{ ...state, dispatch }}>
      {children}
    </Context.Provider>
  );
};

export const useStateValue = () => useContext(Context);
