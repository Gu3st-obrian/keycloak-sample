import Keycloak from "keycloak-js";

/*
Simply declaring new keycloak object with url/realm/clientId endpoints set.
See this link for more information on the keycloak object https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter
*/
const keycloak = new Keycloak({
	url: 'http://<your keycloak domain url>:<your keycloak port>/auth/', // sample url 'http://localhost:8081/auth/',
	realm: '<Your Realm within keycloak>', // sample realm: 'ReactChatApp',
	clientId: '<Your clientId within your Realm>' //sample client id: 'chatApp'
});

export default keycloak;