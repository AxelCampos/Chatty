import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  containerImage: {
    alignItems: 'center',
    height: 300,
  },
  userImage: {
    height: 300,
    width: 400,
  },
  userInformacion: {
    alignItems: 'flex-start',
    height: 150,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  userName: {
    fontSize: 20,
    color: 'black',
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
  menu: {
    height: 550,
    backgroundColor: 'white',
  },
  currentUserIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 6,
    borderColor: '#eee',
    borderBottomWidth: 1,
  },
});
export default styles;
