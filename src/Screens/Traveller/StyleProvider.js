/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-dupe-keys */
import { StyleSheet, Dimensions } from 'react-native';
import Constants from '../../Helpers/constant';

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    paddingTop: 10,
    paddingBottom: 10
  },
  center: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
    // flex: 1
  },

  profileView: {
    backgroundColor: Constants.lightTraveller,
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  mapView: {
    borderRadius: 20,
    // height: (Dimensions.get('screen').height / 100) * 55,
    width: Dimensions.get('screen').width,
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
  },
  mapOrigin: {
    // height: (Dimensions.get('screen').height / 100) * 55,
    width: Dimensions.get('screen').width,
    flex: 1,
  },
  startField: {
    borderColor: Constants.yellow,
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: '#FFDEAB',
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 9,
  },
  endField: {
    borderColor: '#8BFF63',
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: '#E8FFE0',
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    zIndex: 8,
  },
  fieldView: {
    position: 'absolute',
    width: '100%',
    padding: 10,
    paddingHorizontal: 30,
  },
  plusBtn: {
    backgroundColor: Constants.traveller,
    padding: 5,
    borderRadius: 25,
    marginRight: -10,
    marginTop: 10,
  },
  swtichBtn: {
    flexDirection: 'row',
    backgroundColor: Constants.traveller,
    paddingVertical: 10,
    paddingHorizontal: 10,
    // width: 150,
    borderRadius: 12,
    justifyContent: 'center',
  },
  itemdetail: {
    color: Constants.white,
    fontWeight: '700',
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },
  normalField: {
    borderColor: Constants.black,
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: Constants.white,
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50
  },
  mainBg: {
    flex: 1,
    backgroundColor: Constants.lightTraveller,
    // borderTopRightRadius: 40,
    // borderTopLeftRadius: 40,
    borderRadius: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    marginTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,

  },
  cardView: {
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 2,
  },
  card: {
    width: Dimensions.get('screen').width - 40,
    // backgroundColor: Constants.white,
    padding: 20,
    position: 'relative',
    // paddingBottom: 20
  },
  itemName: {
    color: Constants.black,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Helvetica',
  },
  reportBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 70,
    backgroundColor: Constants.white,
    padding: 10,
    borderRadius: 10,
    zIndex: 9
  },
  reportBtntxt: {
    fontWeight: '700',
    color: Constants.black,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Helvetica',
  },
  subCard: {
    flexDirection: 'row',
    // backgroundColor: Constants.red,
    padding: 0,
    borderRadius: 15,
  },
  from: {
    color: Constants.black,
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'right',
    color: Constants.black,
    fontFamily: 'Helvetica',
  },
  to: {
    color: Constants.black,
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'left',
    fontFamily: 'Helvetica',
  },
  noticard: {
    width: Dimensions.get('screen').width - 40,
    backgroundColor: Constants.red,
    padding: 20,
    borderRadius: 20,
    marginVertical: 10,
  },
  chatHeading: {
    width: '100%',
    textAlign: 'center',
    fontSize: 15,
    color: Constants.black,
    marginTop: 5,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: 65,
    height: 65,
    // borderWidth: 2,
    // borderColor: Constants.black,
    borderRadius: 50,
    padding: 2,
    margin: 'auto',
    overflow: 'hidden',
  },
  chatImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 30,
  },
  chatDuration: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  chatContainer: {
    width: '100%',
    minHeight: '50%',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalView2: {
    // margin: 20,
    backgroundColor: 'transparent',
    borderRadius: 10,
    // padding: 35,
    alignItems: 'center',
    gap: 5,
    flexDirection: 'row',
  },
  iconViewStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: Constants.traveller,
  },
  textStyle: {
    color: Constants.black,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 16,
    fontFamily: 'Helvetica',

  },
  modalText: {
    color: Constants.black,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 14,
    fontFamily: 'Helvetica',
  },
  cancelAndLogoutButtonWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  cancelButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.black,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginRight: 15,
    fontFamily: 'Helvetica',
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.traveller,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  showdetail: {
    color: Constants.red,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Helvetica',
  },

  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    elevation: 3,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 12,
    color: 'gray',
  },
  ChitCountainer: {
    backgroundColor: Constants.traveller,
    // display:'flex',
    // flexDirection:'row',
    marginTop: 2,
    marginBottom: 5,
    padding: 10,
    fontFamily: 'Dpdorkdiary',
  },
  acceptButton: {
    fontSize: 17,
    borderRadius: 13,
    textAlign: 'center',
    fontWeight: 'bold',
    color: Constants.black,
    fontFamily: 'Helvetica',
  },
  rejectButton: {
    fontSize: 17,
    color: Constants.black,
    borderRadius: 13,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
  },
  chitText: {
    color: Constants.black,
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5,
    fontFamily: 'Dpdorkdiary',
    fontWeight: '600',
    fontFamily: 'Helvetica',
  },

  // dropdown
  containers: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: Constants.black,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: Constants.white,
    color: Constants.black,
  },
  icon: {
    marginRight: 5,
    color: Constants.black,
  },
  label: {
    color: Constants.black,
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    color: Constants.black,
    fontSize: 16,
  },
  selectedTextStyle: {
    color: Constants.black,
    fontSize: 16,
    fontFamily: 'Helvetica',
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

  keyboard: {
    flex: 1,
    flexDirection: 'column',
  },

  /// profile
  headerView: {
    flexDirection: 'row',
    // paddingHorizontal: 24,
    paddingVertical: 20,
  },

  headerIconView: { flex: 2, flexDirection: 'row', alignItems: 'center' },

  headerTitleText: { color: Constants.black, fontSize: 24, fontWeight: '700', fontFamily: 'Helvetica' },

  editButtonText: {
    color: Constants.black,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Helvetica',
  },

  profileIocnView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 8,
  },

  profileIconAnimatedView: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Constants.traveller,
    // marginBottom: -40,
    // marginTop: 20,
  },

  mainBg2: {
    backgroundColor: Constants.white,
    zIndex: 7,
    flex: 1,
    position: 'relative',
  },

  supportButtonView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'relative',
  },

  supportButton: (isAnim) => {
    return {
      height: isAnim ? 40 : 30,
      width: isAnim ? 40 : 30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };
  },

  supportImg: {
    height: 50,
    width: 50,
    // position: 'absolute',
    right: 0,
    top: 15,
    zIndex: 9,
  },

  userIdText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: Constants.black,
    // marginTop: 10,
    // position: 'absolute',
    // left: 20,
    fontFamily: 'Helvetica'
  },
  userNameView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userNameText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: Constants.black,
    marginTop: 30,
    fontFamily: 'Helvetica'
  },

  travelPlanView: {
    flex: 1,
    // width: Dimensions.get('window').width - 40,
    // backgroundColor: '#fff5e7',
    borderRadius: 20,
    padding: 20,
    // marginTop: 20,
  },
  travelPlanTitleText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: Constants.black,
    fontFamily: 'Helvetica'
  },

  travelPlanCard: {
    backgroundColor: Constants.white,
    borderRadius: 20,
    borderColor: Constants.yellow,
    borderWidth: 2,
    marginTop: 20,
    padding: 10,
  },

  travelPlanCardView: { flex: 1, flexDirection: 'column', gap: 5 },

  fromAddressView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Constants.yellow,
    padding: 5,
    borderRadius: 50,
  },

  feomAddressText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '400',
    color: Constants.black,
    fontFamily: 'Helvetica'
  },

  toAddressView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },


  //home page
  startMarkerView: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: '#FFDEAB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Constants.yellow,
    position: 'relative',
    // overflow: 'hidden'

  },

  box: {
    width: 100,
    height: 100,
  },

  cancelAndLogoutButtonWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  supportOptButton: {
    // flex: 0.5,
    // backgroundColor: Constants.black,
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 10,
    // marginRight: 15,
    // borderWidth: 1,
    // borderColor: Constants.grey,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },

});



export default styles;
