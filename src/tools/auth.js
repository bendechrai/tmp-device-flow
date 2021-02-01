import * as SecureStore from "expo-secure-store";
import jwt_decode from "jwt-decode";

let idToken = null;
let deviceData = null;
let pollTimer = null;

/**
 * Logout!
 */
export const logout = () => {
  // Forget auth data
  idToken = null;
  deviceData = null;

  // Delete any stored token info
  SecureStore.isAvailableAsync().then((isAvailable) => {
    isAvailable && SecureStore.deleteItemAsync("tokens");
  });
};

/**
 * This function will start a device flow auth process with Auth0,
 * store the response locally, and return it to the caller via a promise.
 */
export const getDeviceData = () => {
  return new Promise((resolve, reject) => {
    return fetch("https://bendechrai-demos.au.auth0.com/oauth/device/code", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: "Lr1wti77WyrfcQRvIt5zDAQGeRJNmgQq",
        scope: "openid profile",
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        deviceData = json;
        resolve(deviceData);
      })
      .catch(reject);
  });
};

/**
 * Useful for app restarts, this promise will load any saved token information from
 * secure storage, and resolve with a boolean indicating whether this was successful
 */
export const loadStoredToken = () => {
  return new Promise((resolve, reject) => {
    SecureStore.isAvailableAsync()
      .then((isAvailable) => {
        isAvailable &&
          SecureStore.getItemAsync("tokens")
            .then((tokens) => {
              idToken = JSON.parse(tokens).id_token;
              resolve(true);
            })
            .catch(() => resolve(false));
      })
      .catch(() => reject(false));
  });
};

/**
 * Returns (via promise) the decoded ID Token (JWT) from memory, or polls for the token if not yet loaded.
 */
export const getIdToken = () => {
  return new Promise((resolve, reject) => {
    if (idToken !== null) resolve(jwt_decode(idToken));

    pollForTokens()
      .then((tokens) => {
        idToken = tokens.id_token;
        resolve(jwt_decode(idToken));
      })
      .catch(reject);
  });
};

/**
 * This returns a promise that periodically polls the Auth0 token endpoint for tokens.
 *
 * The promise resolves with the token data, while the id_token is also stored locally in memory.
 *
 * If the process times out or experiences any other issues, the promise will be rejected with an error message.
 */
const pollForTokens = () => {
  return new Promise((resolve, reject) => {
    if (deviceData === null) reject();
    // Try to get tokens from Auth0
    fetch("https://bendechrai-demos.au.auth0.com/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        device_code: deviceData.device_code,
        client_id: "Lr1wti77WyrfcQRvIt5zDAQGeRJNmgQq",
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        // If we have a token
        if (json.id_token) {
          idToken = json.id_token;
          SecureStore.isAvailableAsync().then((isAvailable) => {
            isAvailable &&
              SecureStore.setItemAsync("tokens", JSON.stringify(json));
          });
          resolve(json);
        } else {
          // No token
          let delay = deviceData.interval * 1000;

          // If there's an error, handle it
          switch (json.error) {
            case "slow_down":
              delay *= 2;
            case "authorization_pending":
              pollTimer = setTimeout(() => {
                pollForTokens().then(resolve).catch(reject);
              }, delay);
              break;
            case "expired_token":
              reject("Login timed out. Please try again.");
              break;
            case "access_denied":
              reject(
                "This device isn't authorised for that account. Please try again or contact your service provider."
              );
              break;
            case "invalid_grant":
              reject("An unspecified error occured.");
              break;
            default:
              reject("Not sure what to do with " + JSON.stringify(json));
          }
        }
      });
  });
};

/**
 * Cancels an active pollForTokens() timer
 */
export const cancelTokenPoll = () => {
  clearTimeout(pollTimer);
};
