import * as React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AppDrawer from "./navigation/AppDrawer";

import AuthProvider from "./context/AuthProvider";

const App: () => Node = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppDrawer />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
