import {appleAuth} from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useContext, useEffect, useReducer, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Freshchat} from 'react-native-freshchat-sdk';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ForgotPassword from '../../components/ForgotPassword/ForgotPassword';
import AlertModal from '../../components/modals/AlertModal';
import {GetConfig, isServiceCity} from '../../config/env';
import LanguageContext from '../../context/language.context';
import UserContext from '../../context/user.context';
import {colors} from '../../res/colors';
import constants from '../../res/constants';
import {VALIDATIONS_REGEX} from '../../res/regex';
import {routes} from '../../res/routes';
import AnalitycsService from '../../services/AnalitycsService';
import DeviceService from '../../services/DeviceService';
import OauthService from '../../services/OauthService';
import {actionCreator} from './SignInActions';
import SignInReducer from './SignInReducer';
import {RESET_FORM, SET_EMAIL, SET_PASSWORD} from './SignInTypes';
import ButtonGradient from '../../components/button/ButtonGradient';
import globalStyles from '../../res/styes';
import { fonts } from '../../res/fonts';

const logotipoScity = require('../../assets/logotipo-scity.png');
const logotipoSya = require('../../assets/logotipo-sya.png');

const googleIcon = require('../../assets/google-icon.png');

const EYE_ICON_ON = 'eye';
const EYE_ICON_OFF = 'eye-off';

const SignIn = () => {
  const [state, dispatch] = useReducer(SignInReducer, {
    user: {
      email: '',
      password: '',
    },
  });

  const [showAlert, setShowAlert] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [alertTitle, setAlertTitle] = useState();
  const [alertContent, setAlertContent] = useState();
  const [alertType, setAlertType] = useState();
  const [passwordIcon, setPasswordIcon] = useState(EYE_ICON_OFF);
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();
  const language = useContext(LanguageContext);
  const msg = language.messages.signin;
  const {setAuth} = useContext(UserContext);

  useEffect(() => {
    if (!appleAuth.isSupported) {
      return;
    }
    return appleAuth.onCredentialRevoked(async () => {
      onAlert(
        true,
        msg.signup.alertAtention,
        msg.signin.revokedCredentials,
        constants.NOTIFICATION_TYPE.WARNINNG,
      );
    });
  }, []);

  const onClose = () => {
    resetForm();
    navigation.navigate(routes.drawer.home);
  };
  const onRegister = () => {
    resetForm();
    navigation.navigate(routes.drawer.signUp);
  };

  const resetForm = () => {
    actionCreator(dispatch, RESET_FORM, null);
  };

  const setFirstLogin = async () => {
    const firstLogin = await AsyncStorage.getItem(constants.AUTH.FIRST_LOGIN);

    if (!firstLogin) {
      await AsyncStorage.setItem(constants.AUTH.FIRST_LOGIN, 'true');
      navigation.navigate(routes.home.onboarding);
    } else {
      onClose();
    }
  };

  const onAlert = (visibility, title, content, type) => {
    setAlertTitle(title);
    setAlertContent(content);
    setShowAlert(visibility);
    setAlertType(type);
  };

  const switchPassword = () => {
    passwordIcon === EYE_ICON_OFF
      ? setPasswordIcon(EYE_ICON_ON)
      : setPasswordIcon(EYE_ICON_OFF);
    setShowPassword(!showPassword);
  };

  const identifyFreshChatUser = async (userData) => {
    const userRestoreId = userData?.perfil?.chat_id_externo;
    if (userRestoreId) {
      Freshchat.identifyUser(userData.email, userRestoreId, (error) => {
        throw error;
      });
    }
  };

  const registerDevice = async () => {
    const platform = await AsyncStorage.getItem('device_platform');
    const deviceToken = await AsyncStorage.getItem(constants.STORAGE.DEVICE_TOKEN);
    if(deviceToken) {
      await DeviceService.instance.registerDevice(platform, deviceToken);
    }
  };

  const onPressLoginApple = async () => {
    try {
      let appleAuthRequestResponse = await OauthService.instance.signInWithApple();
      let {identityToken} = appleAuthRequestResponse;
      let response = await OauthService.instance.appleRequestToken(
        identityToken,
      );
      await AsyncStorage.setItem(constants.AUTH.TOKEN, response.access_token);
      await AsyncStorage.setItem(
        constants.AUTH.REFRESH_TOKEN,
        response.refresh_token,
      );
      let authData = await OauthService.instance.getAuthUser();
      authData[constants.AUTH.TOKEN] = response.accessToken;
      setAuth({
        user: authData,
        provider: constants.AUTH.PROVIDER_APPLE,
      });
      AnalitycsService.instance.registerEvent(constants.EVENT_TAGS.SIGNIN, {
        ['user']: authData?.user?.email || null,
      });
      await registerDevice();
      await identifyFreshChatUser(authData);
      await setFirstLogin();
    } catch (error) {
      if (
        error.code === appleAuth.Error.FAILED ||
        error.code === appleAuth.Error.INVALID_RESPONSE
      ) {
        setAlertTitle(error.title);
        setAlertContent(error.message);
        setAlertType(constants.NOTIFICATION_TYPE.ERROR);
        setShowAlert(true);
      }
    }
  };

  const onPressLoginFB = async () => {
    try {
      const FBaccessToken = await OauthService.instance.signInWithFacebook();
      const response = await OauthService.instance.fbRequestToken(
        FBaccessToken,
      );
      await AsyncStorage.setItem(constants.AUTH.TOKEN, response.access_token);
      await AsyncStorage.setItem(
        constants.AUTH.REFRESH_TOKEN,
        response.refresh_token,
      );
      let authData = await OauthService.instance.getAuthUser();
      authData[constants.AUTH.TOKEN] = response.access_token;
      setAuth({
        user: authData,
        provider: constants.AUTH.PROVIDER_FACEBOOK,
      });
      AnalitycsService.instance.registerEvent(constants.EVENT_TAGS.SIGNIN, {
        ['user']: authData?.user?.email || null,
      });
      await registerDevice();
      await identifyFreshChatUser(authData);
      await setFirstLogin();
    } catch (error) {
      let content = error.message;
      if (error.message.includes(constants.MESSAGE_FB_ERROR)) {
        content = error.message.split(constants.MESSAGE_FB_ERROR)[1];
      }
      setAlertTitle(error.title);
      setAlertContent(content);
      setAlertType(constants.NOTIFICATION_TYPE.ERROR);
      setShowAlert(true);
    }
  };

  const onPressLoginGoogle = async () => {
    try {
      const userInfo = await OauthService.instance.signInWithGoogle();
      const response = await OauthService.instance.googleRequestToken(
        userInfo.idToken,
      );
      await AsyncStorage.setItem(constants.AUTH.TOKEN, response.access_token);
      await AsyncStorage.setItem(
        constants.AUTH.REFRESH_TOKEN,
        response.refresh_token,
      );
      let authData = await OauthService.instance.getAuthUser();
      authData[constants.AUTH.TOKEN] = response.access_token;
      setAuth({
        user: authData,
        provider: constants.AUTH.PROVIDER_GOOGLE,
      });
      AnalitycsService.instance.registerEvent(constants.EVENT_TAGS.SIGNIN, {
        ['user']: authData?.user?.email || null,
      });
      await registerDevice();
      await identifyFreshChatUser(authData);
      await setFirstLogin();
    } catch (error) {
      if (error.code !== constants.GOOGLE_SIGNING.USER_CANCEL) {
        setAlertTitle(error.title);
        setAlertContent(error.message);
        setAlertType(constants.NOTIFICATION_TYPE.ERROR);
        setShowAlert(true);
      }
    }
  };

  const onPressLogin = async () => {
    try {
      if (state.user.email.trim() === '' || state.user.password.trim() === '') {
        onAlert(
          true,
          msg.alertAtention,
          msg.allFieldRequired,
          constants.NOTIFICATION_TYPE.WARNINNG,
        );
        return;
      }

      if (!VALIDATIONS_REGEX.email.test(state.user.email)) {
        onAlert(
          true,
          msg.alertAtention,
          msg.wrongEmail,
          constants.NOTIFICATION_TYPE.WARNINNG,
        );
        return;
      }

      let authData = await OauthService.instance.signInWithEmailAndPassword(
        state.user.email,
        state.user.password,
      );

      await AsyncStorage.setItem(constants.AUTH.TOKEN, authData.access_token);
      await AsyncStorage.setItem(
        constants.AUTH.REFRESH_TOKEN,
        authData.refresh_token,
      );

      const userData = await OauthService.instance.getAuthUser();
      authData.user = userData;
      setAuth(authData);

      AnalitycsService.instance.registerEvent(constants.EVENT_TAGS.SIGNIN, {
        ['user']: authData.user?.email || null,
      });
      await registerDevice();
      await identifyFreshChatUser(userData);
      await setFirstLogin();
    } catch (error) {
      if (error.title === 'invalid_grant') {
        onAlert(
          true,
          msg.alertAtention,
          msg.invalidGrant,
          constants.NOTIFICATION_TYPE.WARNINNG,
        );
      } else {
        onAlert(
          true,
          msg.alertAtention,
          error.detail,
          constants.NOTIFICATION_TYPE.WARNINNG,
        );
      }
    }
  };

  return (
    <View style={styles.background}>
      <ScrollView style={styles.form}>
        <View style={styles.headButtons}>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcon
              name="close"
              size={36}
              color={colors.darkGray}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.welcome}>
          <Text style={styles.title} fontFamily={fonts.sourceSansPro_Bold}>{msg.title}</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title} fontFamily={fonts.sourceSansPro_Bold}>{msg.to}</Text>
            <Image
              source={!isServiceCity ? logotipoSya : logotipoScity}
              style={!isServiceCity ? styles.logo : styles.logoScity}
            />
          </View>
        </View>
        <View style={styles.formItem}>
          <Text style={styles.label}>{msg.username}</Text>
          <TextInput
            placeholder={msg.usernamePlaceholder}
            placeholderTextColor={colors.ligthGray}
            selectionColor={colors.black}
            style={globalStyles.input}
            keyboardType={'email-address'}
            autoCapitalize="none"
            value={state.user.email}
            onChangeText={(text) => actionCreator(dispatch, SET_EMAIL, text)}
          />
        </View>
        <Text style={styles.label}>{msg.password}</Text>
        <View style={styles.passwordSection}>
          <TextInput
            placeholder={msg.passwordPlaceholder}
            passwordPlaceholder={msg.passwordPlaceholder}
            placeholderTextColor={colors.ligthGray}
            keyboardType="default"
            style={styles.passwordInput}
            value={state.user.password}
            secureTextEntry={!showPassword}
            onChangeText={(text) => actionCreator(dispatch, SET_PASSWORD, text)}
          />
          <TouchableOpacity onPress={switchPassword}>
            <MaterialCommunityIcon
              name={passwordIcon}
              style={styles.passwordIcon}
              color={colors.black5}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.formItem}>
          <TouchableOpacity
            onPress={() => setShowForgotPassword(!showForgotPassword)}>
            <Text style={styles.link}>{msg.forgotPassword}</Text>
          </TouchableOpacity>
        </View>
        <ButtonGradient
          text={msg.continue}
          action={onPressLogin}
          showArrow
        ></ButtonGradient>
        <TouchableOpacity style={[globalStyles.facebook, globalStyles.shadow]} onPress={onPressLoginFB}>
          <MaterialCommunityIcon
            name="facebook"
            style={styles.materialIcon}
            color={colors.white}
          />
          <Text style={styles.textFacebook} fontFamily={fonts.sourceSansPro_Bold}>{msg.facebook}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.google, globalStyles.shadow]} onPress={onPressLoginGoogle}>
          <Image source={googleIcon} style={styles.icon} />
          <Text style={styles.textGoogle} fontFamily={fonts.sourceSansPro_Bold}>{msg.google}</Text>
        </TouchableOpacity>

        {appleAuth.isSupported && (
          <TouchableOpacity style={[globalStyles.apple, globalStyles.shadow]} onPress={onPressLoginApple}>
            <MaterialCommunityIcon
              name="apple"
              style={styles.materialIcon}
              color={colors.black}
            />
            <Text style={globalStyles.textApple} fontFamily={fonts.sourceSansPro_Bold}>{msg.apple}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.signup} onPress={onRegister}>
          <Text style={styles.signUpText} fontFamily={fonts.sourceSansPro_Bold}>{msg.register}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ignore} onPress={onClose}>
          <Text style={styles.ignoreText}>{msg.ignore}</Text>
        </TouchableOpacity>
      </ScrollView>
      <AlertModal
        visible={showAlert}
        title={alertTitle}
        content={alertContent}
        type={alertType}
        onPress={() => {
          setAlertTitle(undefined);
          setAlertContent(undefined);
          setShowAlert(false);
        }}
      />
      <ForgotPassword
        visible={showForgotPassword}
        onPressCancel={() => setShowForgotPassword(false)}
      />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({ 
  background: {
    flex: 1,
    resizeMode: 'cover',
    padding: 16,
    backgroundColor: colors.white,
  },
  welcome: {
    marginVertical: 20,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logo: {
    height: 40,
    resizeMode: 'stretch',
    width: 164,
    marginLeft: 10,
  },
  logoScity: {
    height: 45,
    resizeMode: 'stretch',
    width: 164,
    marginLeft: 10,
    marginTop: 5,
  },
  headButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  title: {
    color: colors.black,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 10,
  },
  formItem: {
    paddingVertical: 5,
  },
  label: {
    color: colors.black,
    marginVertical: 8,
    fontWeight: 'bold',
    fontFamily: fonts.sourceSansPro_Bold
  },
  passwordSection: {
    borderRadius: 10,
    height: 34,
    fontSize: 13,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.ultraLightGray,
    paddingHorizontal: 16,
  },
  passwordLabel: {
    color: colors.white,
    marginVertical: 8,
    fontWeight: 'bold',
  },
  passwordInput: {
    flex: 1,
    padding: 0,
    maxWidth: '80%',
    fontWeight: 'normal',
    fontSize: 13,
    fontFamily: fonts.sourceSansPro_Regular
  },
  passwordIcon: {
    paddingHorizontal: 10,
    fontSize: 25,
  },
  icon: {
    height: 28,
    resizeMode: 'contain',
    width: 28,
    marginHorizontal: 5,
  },
  materialIcon: {
    fontSize: 28,
    marginHorizontal: 5,
  },
  link: {
    color: colors.black,
    marginVertical: 8,
    fontWeight: 'bold',
    textDecorationColor: colors.white,
    textDecorationStyle: 'solid',
    textDecorationLine: 'none',
    textAlign: 'right',
    fontSize: 14,
  },
  textWhite: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continue: {
    borderRadius: 8,
    padding: 15,
  },
  signup: {
    paddingBottom: 10,
    paddingTop: 30,
  },
  signUpText: {
    color: colors.black,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationColor: colors.white,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    fontSize: 14,
  },
  facebook: {
    padding: 8,
    backgroundColor: colors.facebook,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 44,
    marginTop: 44,
    marginBottom: 10,
  },
  textFacebook: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 3,
    marginLeft: 4,
  },
  google: {
    padding: 8,
    backgroundColor: colors.google,
    borderColor: colors.ultraLightGray,
    borderWidth: 1, 
    borderRadius: 8,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 44,
    marginBottom: 10,
  },
  textGoogle: {
    color: colors.black,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 3,
    marginLeft: 4,
  },
  ignore: {
    paddingVertical: 20,
  },
  ignoreText: {
    color: colors.white,
    textAlign: 'center',
    textDecorationColor: colors.white,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
});
