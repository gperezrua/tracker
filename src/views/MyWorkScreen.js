import React from "react";
import { View, Text, Button } from 'react-native';
import { useNavigation } from "@react-navigation/native";


const MyWorkScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>MyWork Screen</Text>
      <Button
        title="Go to Home... again"
        onPress={() => navigation.push("Home")}
      />
    </View>
  );
};

export default MyWorkScreen;
