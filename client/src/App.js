import React from 'react';
import './App.css';

import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Main from './components/Main';

function App() {
  return (
    <div className="App">
      <Router>
					<Switch>
						<Route
							exact
							path="/login"
							component={Login}
						/>
					</Switch>
					<Switch>
						<Route
							exact
							path="/signup"
							component={SignUp}
						/>
					</Switch>
					<Switch>
						<Route
							exact
							path="/"
							component={Main}
						/>
					</Switch>
				</Router>
    </div>
  );
}

export default App;
