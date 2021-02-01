import React, { useEffect, useState } from "react";
import { Text, View, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import QRCode from "react-native-qrcode-svg";

import { getDeviceData, cancelTokenPoll, getIdToken } from "../tools/auth";

import { styles } from "../styles";

export default LoginPrompt = ({ successCallback }) => {
  const [deviceData, setDeviceData] = useState(null);

  const login = async () => {
    // Start device auth flow
    getDeviceData().then((deviceData) => {
      // If device auth flow data is available
      if (deviceData) {
        // Update local state so rendered output has required data
        setDeviceData(deviceData);

        // Wait until we get a token and then send it to the success callback so the main app can update
        getIdToken().then((token) => {
          successCallback(token);
        });
      }
    });
  };

  useEffect(() => {
    // Define component unload script to stop any token polling
    return () => {
      cancelTokenPoll();
    };
  }, []);

  return (
    <>
      <Text style={styles.header}>
        Welcome to your new Internet Enabled Fridge
      </Text>
      {deviceData === null && (
        <>
          <Button style={styles.button} title="Start" onPress={login}>
            <Text style={styles.buttonText}>Start</Text>
          </Button>
        </>
      )}
      {deviceData !== null && (
        <View style={styles.deviceCode}>
          <View style={styles.deviceCodePane}>
            <Text>
              To complete the login process, go to the following URL on your
              smartphone or computer
            </Text>
            <Text style={styles.highlight}>{deviceData.verification_uri}</Text>
            <Text>The user code you'll be asked for is:</Text>
            <Text style={styles.highlight}>{deviceData.user_code}</Text>
          </View>
          <View style={styles.deviceCodePane}>
            <Text>This can also be done by scanning this QR Code:</Text>
            <QRCode value={deviceData.verification_uri_complete} size={300} />
          </View>
        </View>
      )}
      <StatusBar style="auto" />
    </>
  );
};
