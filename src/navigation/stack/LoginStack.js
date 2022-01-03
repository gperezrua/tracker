import React from "react";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "../../views/Login";

const Stack = createStackNavigator();
const options = { headerShown: false };

const LoginStack = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="LoginScreen" component={Login} options={options} />
    </Stack.Navigator>
  );
};

export default LoginStack;
