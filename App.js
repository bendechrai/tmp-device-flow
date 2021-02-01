import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";

import LoginPrompt from "./src/pages/login";
import Dashboard from "./src/pages/dashboard";

import { loadStoredToken, logout } from "./src/tools/auth";
import { styles } from "./src/styles";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Can we get the token from storage (keep user logged in after app restart)
    loadStoredToken().then((success) => {
      setIsAuthenticated(success); // State change to show correct view
      setIsLoading(false);
    });
  }, []);

  const logoutCallback = () => {
    logout(); // Auth logout
    setIsAuthenticated(false); // State change to show LoginPrompt
  };

  return (
    <SafeAreaView style={styles.container}>
      {!isLoading && (
        <>
          {!isAuthenticated && (
            <LoginPrompt successCallback={setIsAuthenticated} />
          )}
          {isAuthenticated && <Dashboard logoutCallback={logoutCallback} />}
        </>
      )}
    </SafeAreaView>
  );
}
