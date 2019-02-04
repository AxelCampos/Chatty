import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  containerImage: {
    alignItems: 'center',
    height: 300,
    marginBottom: 5,
  },
  userImage: {
    height: 300,
    width: 400,
  },
  userInformacion: {
    alignItems: 'flex-start',
    height: 230,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  userNameContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  userName: {
    flex: 3,
    fontSize: 30,
    color: 'black',
  },
  icons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 35,
  },
  iconStyle: {
    alignItems: 'center',
    paddingStart: 9,
    paddingEnd: 0,
    width: 50,
    borderWidth: 0.7,
    marginHorizontal: 5,
  },
  locationUser: {
    marginTop: 10,
    marginBottom: 10,
  },
  conexionStyle: {
    marginTop: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    marginHorizontal: 5,
  },
  album: {
    paddingBottom: 100,
  },
  photoContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    backgroundColor: '#F3E7E4',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    margin: 3,
  },
  albumImage: {
    width: 90,
    height: 90,
    borderRadius: 5,
  },
  menu: {
    height: 550,
    backgroundColor: 'white',
  },
});

export default styles;
