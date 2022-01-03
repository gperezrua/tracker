import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import AuthenticatedStack from "./stack/AuthenticatedStack";
import NotificationStack from "./stack/NotificationStack";
import LoginStack from "./stack/LoginStack";

const Drawer = createDrawerNavigator();
AppDrawer = () => {
  const [auth, setAuth] = useState({ authenticated: false });

  return (
    <Drawer.Navigator>
      {!auth.authenticated ? (
        <Drawer.Screen name="Login" component={LoginStack} />
      ) : (
        <>
          <Drawer.Screen
            name="AuthenticatedStack"
            component={AuthenticatedStack}
          />
          <Drawer.Screen
            name="NotificationStack"
            component={NotificationStack}
          />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default AppDrawer;
