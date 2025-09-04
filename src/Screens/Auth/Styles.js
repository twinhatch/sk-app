/* eslint-disable no-dupe-keys */
/* eslint-disable prettier/prettier */
import { StyleSheet, Dimensions, Platform } from 'react-native';
import Constants from '../../Helpers/constant';

const Styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    padding: 20,
    // paddingTop: 50,
    // paddingVertical:50
  },
  logoView: {
    width: Dimensions.get('window').width - 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  logoImg: {
    height: 200,
    width: 200,
    borderRadius: 5,
    // marginTop: 15,
  },
  title: {
    fontSize: 24,
    color: Constants.black,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    textAlign: 'left',
    fontFamily: 'Helvetica'
  },
  subtitle: {
    fontSize: 14,
    color: Constants.grey,
    fontWeight: '400',
    fontFamily: 'Helvetica',
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'Helvetica'
  },
  fieldView: {
    backgroundColor: Constants.white,
    // width: Dimensions.get('window').width - 40,
    minHeight: 50,
    marginTop: 25,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: Constants.red,
    borderWidth: 1,
    paddingHorizontal: 10,
    position: 'relative',
    flex: 1,
    // paddingVertical: 5,
  },
  fieldView2: {
    backgroundColor: Constants.white,
    // width: Dimensions.get('window').width - 40,
    minHeight: 64,
    marginTop: 25,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: Constants.red,
    borderWidth: 1,
    paddingHorizontal: 10,
    position: 'relative',
    // paddingVertical: 5,
  },
  label: {
    position: 'absolute',
    top: -13,
    left: 20,
    backgroundColor: Constants.white,
    color: Constants.black,
    padding: 2,
    paddingLeft: 5,
    fontFamily: 'Helvetica'
  },

  iconView: {
    height: 45,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    // borderRightWidth: 4,
    // borderRightColor: Constants.blue,
  },
  icon: {
    height: 25,
    // width: 18,
  },
  input: {
    // marginLeft: 10,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Helvetica',
    color: Constants.black,
    flex: 1,
  },

  input2: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Helvetica',
    color: Constants.black,
  },
  labeStyle: {
    fontSize: 16,
    // fontFamily: 'Mulish-Bold',
    // color: Constants.lightgrey,
  },
  radioView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // flexWrap: 'wrap',
    width: 240,
  },

  acountBtn: {
    alignItems: 'center',
    // marginTop: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    marginLeft: Platform.OS === 'ios' ? 20 : 0,
    marginTop: 30,
  },
  Already: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    color: Constants.black,
    // fontFamily: 'Mulish-Regular',
  },
  signin: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    color: Constants.red,
    //   fontFamily: 'Mulish-Regular',
  },
  forgot: {
    color: Constants.black,
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Helvetica'
  },
  codeFieldRoot2: { width: Dimensions.get('window').width - 40 },
  cell: {
    width: 70,
    height: 70,
    lineHeight: 68,
    fontSize: 30,
    fontWeight: '700',
    fontFamily: 'Helvetica',
    // borderWidth: 2,
    // borderColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    color: Constants.black,
    backgroundColor: Constants.white,
    borderColor: Constants.white,
    borderWidth: 1,
  },

  cell2: {
    width: 40,
    height: 40,
    lineHeight: 40,
    fontSize: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    color: '#fff',
  },
  focusCell: {
    borderColor: '#E98607',
  },

  applyBtn: {
    backgroundColor: Constants.red,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 65,
    paddingHorizontal: 20,
    // width: Dimensions.get('window').width - 40,
    marginTop: 20,
    // flex: 1
  },
  applyBtnTxt: {
    color: Constants.white,
    fontWeight: '500',
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 25,
    fontFamily: 'Helvetica'
  },

  containers: {
    backgroundColor: 'white',
    padding: 16,
    height: 55,
  },
  dropdown: {


    paddingHorizontal: 20,
    // width: '100%',
    alignSelf: 'center',
    // marginTop: 10,

    backgroundColor: Constants.white,
    color: Constants.black,
    width: Dimensions.get('window').width - 50,
  },
  icon: {
    marginRight: 5,
    color: Constants.black,
  },
  // label: {
  //   color: Constants.black,
  //   position: 'absolute',
  //   backgroundColor: 'white',
  //   left: 22,
  //   top: 8,
  //   zIndex: 999,
  //   paddingHorizontal: 8,
  //   fontSize: 14,
  // },
  placeholderStyle: {
    color: Constants.black,
    fontSize: 16,
  },
  selectedTextStyle: {
    color: Constants.black,
    fontSize: 16,
  },
  iconStyle: {
    // color: Constants.black,
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    color: Constants.black,
    height: 40,
    fontSize: 16,
  },
});

export default Styles;
