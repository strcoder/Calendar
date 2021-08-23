import React from 'react';
import App from './App';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import { Provider } from './context';
import './sass/index.scss';

const app = document.getElementById('App');
const history = createBrowserHistory();

const id = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

if (!id || !token) {
  ReactDOM.render(
    <Provider initialState={{}}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>,
    app
  );
}

if (id && token) {
  fetch(`https://crea-api.vercel.app/api/user/${id}`, { method: 'get' })
  .then(response => response.json())
  .then(({ data }) => {
    // console.log(data);
    const user = data;
    fetch(`https://crea-api.vercel.app/api/team/${user.team[0]}`, { method: 'get' })
    .then(response => response.json())
    .then(({ data }) => {
      ReactDOM.render(
        <Provider initialState={{ user, team: data }}>
          <Router history={history}>
            <App />
          </Router>
        </Provider>,
        app
      );
    });
  });
  // const team = { name: '', manager: '', memebers: [], meetings: [] };
  // initialState.team = team;
}