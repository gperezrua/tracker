import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { fonts } from "./fonts";

export default StyleSheet.create({
  shadow: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  labelForm: {
    color: colors.black,
    marginVertical: 8,
    fontWeight: "bold",
    fontSize: 14,
  },
  label: {
    color: colors.black,
    marginVertical: 8,
    fontWeight: "bold",
    fontFamily: fonts.sourceSansPro_Bold,
  },
  titleForm: {
    color: colors.black,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    padding: 8,
    backgroundColor: colors.facebook,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    height: 44,
    marginTop: 25,
    marginBottom: 5,
  },
  input: {
    height: 40,
    backgroundColor: colors.ultraLightGray,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: fonts.sourceSansPro_Regular,
  },
  icon: {
    fontSize: 28,
    marginHorizontal: 5,
  },
  ph10: {
    paddingHorizontal: 10,
  },
  pv5: {
    paddingVertical: 5,
  },
});
