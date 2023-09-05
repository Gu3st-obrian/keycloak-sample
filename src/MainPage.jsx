import React from 'react';
import './css/MainPage.css';
import {Outlet, Link } from 'react-router-dom';
import {checkLocalStorage, handleLogout} from './Common.js';

import keycloak from './myKeycloak.js';

/*
* This is the main page component.  Simply displays what dependencies are needed by this project.
* Also has links to the Logged in page, the actual login link and the logout link.
*/
class MainPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			logoutUrl: props.logoutUrl	
		};

        // binded functions
		this.initKeycloak = this.initKeycloak.bind(this);
	}

	/**
	 * Invokes init method from keycloak object.  This causes user to have to login via keycloak.
	 */
	initKeycloak() {
		keycloak.init({
			onLoad: 'login-required',
			redirectUri: 'http://localhost:3000/LoggedInPage'
        }).success(function() {
			// intentionally blank as the user gets routed to the LoggedInPage
        }).error(function(error) {
			// intentionally blank as the user gets routed to the LoggedInPage
        }).catch(function() {
			// intentionally blank as the user gets routed to the LoggedInPage
        });
	}

	/**
	* Component is loaded/mounted on the page. 
	*/
	componentDidMount() {

        // simply log debug information.
        //console.log('[MainPage] componentDidMount() -> is user authenticated: ' + keycloak.authenticated);
        var localKC = checkLocalStorage();
        if (localKC !== null && localKC !== undefined) {
			console.log('[MainPage] componentDidMount() -> localKC from localStorage isn\'t null.');
        } else {
        	console.log('[MainPage] componentDidMount() -> localKC is either null or undefined -> ' + localKC);
        }
    }

	/**
	* Component is unloaded/unmounted from the page.
	*/
	componentWillUnmount() {
		// intentionally blank
	}

    /**
	* 1 to have the user login.  The 2nd to have the user logout.  The 3rd is a link to a LoggedInPage component.
	* In addition to that it just displays what I used in this project, ie dependencies, to get it to work.
	*/
	render() {

	  return (
		<div>
			<nav className="mainPageNav">
						|{" "}
				     <a href="#"><span onClick={() => this.initKeycloak()}>Login</span></a> |{" "}
       			     <a href="#" onClick={() => handleLogout(this.state.logoutUrl)}>Logout</a> |{ " "}
                    <Link to="/LoggedInPage">LoggedInPage</Link> |{" "}
			</nav>
			<Outlet />

			<div className="MainPage">
				<p>
					Welcome everyone!  This is a ReactJS app example working with Keycloak!
				</p>
				<p>
				Requirements to get this to work.
				</p>
				<ul>
					<li>Keycloak installed</li>
					<li>DBEndpoint that your keycloak connects with.</li>
					<li>Realm with a client app for the react app to authenticate</li>
					<li>"keycloak-js": "^20.0.0"</li>
					<li>"react-router-dom": "^6.4.3"</li>
				</ul>

			</div>
		</div>
	  );
	}
}
export default MainPage;
