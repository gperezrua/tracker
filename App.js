import * as React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AppDrawer from "./src/navigation/AppDrawer";

import { AuthContext } from "./src/context/AuthContext";

const App: () => Node = () => {
  return (
    <AuthContext.Provider
      value={{
        auth: {},
        setAuth,
        loading,
        setLoading,
      }}
    >
      <NavigationContainer>
        <AppDrawer />
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
