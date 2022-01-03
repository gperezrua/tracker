import React, { useContext, useReducer } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

import LoginActionCreator from "../redux/signin/LoginActions";
import LoginReducer from "../redux/signin/LoginReducer";
import { SET_EMAIL, SET_PASSWORD } from "../redux/signin/LoginTypes";

import AuthContext from "../context/AuthContext";

import { colors } from "../style/colors";
import { fonts } from "../style/fonts";
import globalStyles from "../style/styles";

const logo = require("../assets/images/logo/rua-group.png");
const msg = {
  title: "Bienvenido",
  username: "E-mail",
  usernamePlaceholder: "Escribe tu mail",
  password: "Contraseña",
  passwordPlaceholder: "Escribir contraseña",
  forgotPassword: "¿Olvidaste tu contraseña?",
  continue: "Entrar",
};

const Login = () => {
  const [state, dispatch] = useReducer(LoginReducer, {
    user: {
      email: "",
      password: "",
    },
  });

  const auth = useContext(AuthContext);
  const onClose = () => {};
  const switchPassword = () => {};

  return (
    <View style={styles.background}>
      <ScrollView style={globalStyles.ph10}>
        <View style={styles.welcome}>
          <Text style={styles.title} fontFamily={fonts.sourceSansPro_Bold}>
            {msg.title}
          </Text>
          <View style={styles.titleContainer}>
            <Image source={logo} style={styles.logo} />
          </View>
        </View>
        <View style={globalStyles.pv5}>
          <Text style={globalStyles.label}>{msg.username}</Text>
          <TextInput
            placeholder={msg.usernamePlaceholder}
            placeholderTextColor={colors.ligthGray}
            selectionColor={colors.black}
            style={globalStyles.input}
            keyboardType={"email-address"}
            autoCapitalize="none"
            value={state.user.email}
            onChangeText={(text) =>
              LoginActionCreator(dispatch, SET_EMAIL, text)
            }
          />
        </View>
        <Text style={globalStyles.label}>{msg.password}</Text>
        <View style={styles.passwordSection}>
          <TextInput
            placeholder={msg.passwordPlaceholder}
            passwordPlaceholder={msg.passwordPlaceholder}
            placeholderTextColor={colors.ligthGray}
            keyboardType="default"
            style={styles.passwordInput}
            value={state.user.password}
            onChangeText={(text) =>
              LoginActionCreator(dispatch, SET_PASSWORD, text)
            }
          />
          <TouchableOpacity onPress={switchPassword}>
            <MaterialCommunityIcon
              name="eye"
              style={styles.passwordIcon}
              color={colors.black5}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.formItem}>
          <TouchableOpacity>
            <Text style={styles.link}>{msg.forgotPassword}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[globalStyles.button, globalStyles.shadow]}>
          <MaterialCommunityIcon
            name="login"
            style={globalStyles.icon}
            color={colors.white}
          />
          <Text style={styles.loginText} fontFamily={fonts.sourceSansPro_Bold}>
            {msg.continue}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    padding: 16,
    backgroundColor: colors.white,
  },
  welcome: {
    marginVertical: 20,
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  logo: {
    height: 164,
    resizeMode: "stretch",
    width: 164,
    marginLeft: 10,
  },
  headButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  title: {
    color: colors.black,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },

  passwordSection: {
    borderRadius: 10,
    height: 40,
    fontSize: 13,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.ultraLightGray,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    padding: 0,
    maxWidth: "80%",
    fontWeight: "normal",
    fontSize: 13,
    fontFamily: fonts.sourceSansPro_Regular,
  },
  passwordIcon: {
    paddingHorizontal: 10,
    fontSize: 25,
  },
  link: {
    color: colors.black,
    marginVertical: 8,
    fontWeight: "bold",
    textDecorationColor: colors.white,
    textDecorationStyle: "solid",
    textDecorationLine: "none",
    textAlign: "right",
    fontSize: 14,
  },
  loginText: {
    color: colors.white,
    textAlign: "center",
    fontSize: 16,
    marginTop: 3,
    marginLeft: 4,
  },
});

export default Login;
