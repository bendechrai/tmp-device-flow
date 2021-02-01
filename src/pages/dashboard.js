import React from "react";
import { Button, Image, Text, View } from "react-native";
import { useEffect, useState } from "react/cjs/react.development";

import { styles } from "../styles";
import { getIdToken } from "../tools/auth";
import { CamelCaseWithSpaces } from "../tools/stringHelper";

export default Dashboard = ({ logoutCallback }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On load, get the ID Token so we can show the user info in this view
    getIdToken().then(setUser);
  }, []);

  return (
    <View style={styles.container}>
      {user !== null && (
        <>
          <Text style={styles.header}>
            Hello {CamelCaseWithSpaces(user.nickname)}!
          </Text>
          <Image
            source={{ uri: user.picture }}
            style={{ width: 200, height: 200 }}
          />
          <Button style={styles.button} title="Logout" onPress={logoutCallback}>
            <Text style={styles.buttonText}>Logout</Text>
          </Button>
        </>
      )}
    </View>
  );
};
