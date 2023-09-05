import './css/LoggedInPage.css';
import React  from 'react';
import {  Link } from "react-router-dom";
import {checkLocalStorage, handleLogout} from './Common.js';
import keycloak from './myKeycloak.js';

/*
* This page is where the user gets routed to after logging in via keycloak.
* This page simply displays the users full name as it is stored in keycloak.
*/
class LoggedInPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// user's name to be displayed in the welcome/logged in page.
			usersName: '',
            // logout url passed in from parent component.
			logoutUrl: props.logoutUrl
		};

		// binded functions
        this.loadData = this.loadData.bind(this);
        this.reloadData = this.reloadData.bind(this);
		
        this.handleLoad = this.handleLoad.bind(this);
        this.unhandleLoad = this.unhandleLoad.bind(this);

		this.setStateCallBack = this.setStateCallBack.bind(this);

	}

	 /**************************************************************************
	 *  Call back method for when setState for users name is set.
	 * this will set the keycloak object to session/local storage.
	 **************************************************************************/
	setStateCallBack (saveData) {
		//console.log('[LoggedInPage] setStateCallBack() -> saveData: ' + saveData + ' -- kc authenticated: ' + keycloak.authenticated);
		if ( saveData) { 
			localStorage.setItem('keycloakInfo', JSON.stringify(keycloak));
		} else {
			localStorage.removeItem('keycloakInfo');
		}
	}

 /**************************************************************************
 *  Supposed to be called once when the page is loaded.
 *  Calls handleLoad function upon page being loaded up.
 *  Also invokes a function on a timeout variable.
 **************************************************************************/
	componentDidMount() {

		var localKC = checkLocalStorage();
		if (localKC !== null && localKC !== undefined) {
			//console.log('[LoggedInPage] componentDidMount() -> localKC from localStorage isn\'t null.');
			this.setState({usersName: localKC.idTokenParsed.name});
			return;
		} else {
			//console.log('[LoggedInPage] componentDidMount() -> localKC is either null or undefined -> ' + localKC);
		}

        // check if user refreshed the page or not.
		if (window.performance) {
		  if (performance.navigation.type == 1) {
			console.log( "[LoggedInPage] componentDidMount() -> This page is reloaded.  This state username: " + this.state.usersName + " -- is user authenticated: " + keycloak.authenticated);
   
			keycloak.init({
				onLoad: 'login-required',
				enableLogging: true, 
				redirectUri: 'http://localhost:3000/LoggedInPage'
			}).then(function(authenticated) {
				 if (!authenticated) {
					 // if user still not authenticated then re-routes user to the main page.
					 window.location.replace('http://localhost:3000/');
				 } else {
					 // if authenticated then will reload the users data and updates the token.
					this.reloadData();
				 }
			}.bind(this)).catch(function() {
				console.log('check sso called.  Error occurred');
			});

		  } else {
			//console.log( "[LoggedInPage] componentDidMount() -> This page is not reloaded");
			this.handleLoad();
		  }
		}
    }
	
	/******************************************************************************
	* Will be called when component is unloaded/unmounted from the page.
	******************************************************************************/
	componentWillUnmount() {
	   window.removeEventListener('load', this.unhandleLoad);
	}

	/***************************************************************************
	* Gets called when the component is updated.  Here just displaying 
	* debug data.
	***************************************************************************/
	componentDidUpdate(prevState) {

		if(this.state.usersName !== prevState.usersName) {
			if (this.state.usersName !== undefined && this.state.usersName !== null) {
				//var txt = document.getElementById('welcomeHeader').innerHTML;
				//console.log('[LoggedInPage] componentDidUpdate() -> welcomeHeader html id has value: ' + txt + ', users name is: ' + this.state.usersName);
			}
		}
	}

 /**************************************************************************
 * Called by ComponentDidMount() function.
 * This method does an init check if the keycloak user isn't authenticated.
 * If the user is authenticated it then calls a setState function to request an re-render of the HTML.
 **************************************************************************/
 handleLoad() {

	if (keycloak.authenticated === true) {
        //console.log('[LoggedInPage] handleLoad() -> user authenticated.  Users name: ' + keycloak.idTokenParsed.name);

		this.reloadData();
		this.setState({usersName: keycloak.idTokenParsed.name}, this.setStateCallBack(true));

	} else {

        //console.log('[LoggedInPage] handleLoad() -> user not authenticated.  Calling keycloak init check-sso');

        keycloak.init({
			onLoad: 'check-sso',
			enableLogging: true, 
			silentCheckSsoRedirectUri: 'http://localhost:3000/LoggedInPage'
        }).then(function(authenticated) {
			console.log('[LoggedInPage] handleLoad() -> check-sso authenticated: ' + authenticated);

			if (authenticated) {
				this.reloadData();
       			this.setState({usersName: keycloak.idTokenParsed.name}, this.setStateCallBack(true));
			} else {
       			this.setState({usersName: ''}, this.setStateCallBack(false));
				handleLogout(this.state.logoutUrl);
			}
        }.bind(this)).catch(function() {
               //console.log('[LoggedInPage] handleLoad() -> check-sso call failed.');
        });
     }
 }

 /********************************************************************
 * Called when the component is unloaded.  Here simply just display a log message.
 ********************************************************************/
 unhandleLoad() {
     //console.log('[LoggedInPage] unloaded () -> called.');
 }
 
  /********************************************************************
 * Loads user data from keycloak.
 * This is called from keycloak updateToken callback.
 ********************************************************************/
 loadData () {
    //console.log('[LoggedInPage] loadData() -> user id: ' + keycloak.subject  + ', still authenticated? ' + keycloak.authenticated);

    if (keycloak.idToken) {

        console.log('[LoggedInPage] loadData() -> IDToken -> username' + keycloak.idTokenParsed.preferred_username + ', email: ' + keycloak.idTokenParsed.email + 
		', name: ' + keycloak.idTokenParsed.name + ', given name: ' + keycloak.idTokenParsed.given_name + ', family name: ' + keycloak.idTokenParsed.family_name);

		this.setState({usersName: keycloak.idTokenParsed.name}, this.setStateCallBack(true));

    } else {

        keycloak.loadUserProfile(function() {
            console.log('[LoggedInPage] loadData()-> loadUserProfile() -> Account Service -> username: ' + keycloak.profile.username + ', email: ' + keycloak.profile.email +
            ', first name: ' + keycloak.profile.firstName + ', last name: ' + keycloak.profile.lastName);

            this.setState({usersName: keycloak.profile.firstName + ' ' + keycloak.profile.lastName}, this.setStateCallBack(true));
        }, function() {
            //console.log('[LoggedInPage] loadData()-> Failed to retrieve user details. Please enable claims or account role');
        });
    }
}

 /************************************************************************************************
 * Updates the users keycloak token
 ************************************************************************************************/
 reloadData () {
    //console.log('[LoggedInPage] reloadData() -> calling updateToken');

    keycloak.updateToken(40) // does this have to be lesser than the 'Client Session Idle', 'Client Session Max', and 'Access Token Lifespace'
            .success(this.loadData)
            .error(() => {
                console.log('[LoggedInPage] reloadData() ->Failed to load data.  User is logged out?? Clearing token and logging out.');
                keycloak.clearToken();
                keycloak.logout();
            });
 }

	/***************************************************************************************************
	* RENDER method.
	* Simply displays users name if they are logged in.
	* Also has links to go back to the home page and to logout.
	***************************************************************************************************/
	render() {

	// Retrieves users username from keycloak object.
	const UserHTML = (this.state.usersName !== undefined ? this.state.usersName : 'no name' );

     //console.log('Render -> usersHtml: ' + UserHTML);
	  return (
         <div>
            <nav className="sidenavLoggedIn">
			  <Link to="/">Home</Link> 
			  <a href="#" onClick={() => handleLogout(this.state.logoutUrl)}>Logout</a> |{ " "}
			</nav>

            <div className="mainLoggedIn">
			  <header className="loggedInPagePage-header">
				<h1 id="welcomeHeader"> Welcome {UserHTML}! </h1>
				<p>You're now logged in!</p>
			  </header>
            </div>
         </div>
	  );
    }
}

export default LoggedInPage;