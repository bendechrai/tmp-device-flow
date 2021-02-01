import { StyleSheet } from "react-native";

///////////////////////////////////////
//
//   STYLES
//
///////////////////////////////////////
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 30,
    marginBottom: 50,
  },
  deviceCode: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    flexWrap: "wrap",
  },
  deviceCodePane: {
    padding: "5%",
    maxWidth: 350,
  },
  highlight: {
    backgroundColor: "#ccc",
    marginVertical: 5,
    textAlign: "center",
    fontSize: 15,
  },
  button: {
    backgroundColor: "teal",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 20,
    borderRadius: 5,
    elevation: 4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
});
