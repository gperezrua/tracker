import React from "react";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "../../views/Login";
import HomeScreen from "../../views/HomeScreen";
import ServiceScreen from "../../views/ServiceScreen";
import MyWorkScreen from "../../views/MyWorkScreen";
import NotificationsScreen from "../../views/NotificationsScreen";

const Stack = createStackNavigator();
const options = { headerShown: false };

const AuthenticatedStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator initialRouteName="MyWork">
      <Stack.Screen name="MyWorkScreen" component={MyWorkScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ServiceScreen" component={ServiceScreen} />
    </Stack.Navigator>
  );
};

export default AuthenticatedStack;
