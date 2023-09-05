import React from 'react';
import Keycloak from 'keycloak-js';
import MainPage from './MainPage'; 
import LoggedInPage from './LoggedInPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

/**
* This is the main app component.  Simply creates the Routes that links to Components.
*/
class MainApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// logout url to be invoked when user selects the Logout URL link, Replace the below with your keycloak url and the redirect_uri you want it to be
			logoutUrl: 'http://<your keycloak url>:<keycloak port #>/auth/realms/<Your Realm>/protocol/openid-connect/logout?redirect_uri=<url you want to redirect to>' // sample url: 'http://localhost:8081/auth/realms/ReactChatApp/protocol/openid-connect/logout?redirect_uri=http://localhost:3000'
		};
	}

	/**
	* Component is loaded/mounted on the page. 
	*/
	componentDidMount() {
		// intentionally blank
	}

	/**
	* Component is unloaded/unmounted from the page.
	*/
	componentWillUnmount() {
		// intentionally blank
	}

    /**
	 * This also passes the state keycloak object and the logout URL to the child components.
    */
	render() {
	  return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<MainPage logoutUrl={this.state.logoutUrl} />} />
					<Route path="LoggedInPage" element={<LoggedInPage logoutUrl={this.state.logoutUrl}  />} />
				</Routes>
			</BrowserRouter>
		</div>
	  );
	}
}
export default MainApp;