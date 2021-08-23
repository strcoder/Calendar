import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Layout from './containers/Layout';
import Landing from './pages/Landing';
import { useStateValue } from './context';
import HomeManager from './pages/HomeManager';
import Team from './pages/Team';
import Weekend from './pages/Weekend';
import Meetings from './pages/Meetings';

const App = () => {
  const { user, team } = useStateValue();
  // console.log(user);
  // console.log(team);

  if (user && team?.manager?._id === user?._id) {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path={['/', '/home']} component={HomeManager} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }

  if (user && team?.manager?._id !== user?._id) {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path={['/', '/home']} component={Home} />
            <Route exact path='/team' component={Team} />
            <Route exact path='/schedule' component={Weekend} />
            <Route exact path='/meetings' component={Meetings} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route exact path={['/', '/home']} component={Landing} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
