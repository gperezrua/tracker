import React from "react";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import NotificationsScreen from "../../views/NotificationsScreen";

const Stack = createStackNavigator();
const options = { headerShown: false };

const NotificationStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator initialRouteName="NotificationsScreen" screenOptions={options}>
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

export default NotificationStack;
