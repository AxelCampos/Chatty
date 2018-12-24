import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        //justifyContent: 'flex-start', //'center', 'flex-start', 'flex-end', 'space-around', 'space-between', 'space-evenly', baseline
        //alignItems: "flex-start", //'center', 'flex-start', 'flex-end', 'stretch', baseline,
        paddingTop: 10
    },
    header: {
        flex: 0.35,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        marginTop: 5,
    },
    main: {
        flex: 0.65,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 5,
    },
    buttonCrearSearch: {
        padding: 6,
        borderColor: '#eee',
        borderBottomWidth: 1,
        //position: 'absolute',
        //left: 30,
        //width: 150,
    },
    viewButtonBusquedas: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        padding: 1,
    },
    viewButtonNueva: {
        flex: 0.5,
        padding: 6,
    },
    viewButtonVer: {
        flex: 0.5,
        padding: 6,
    },
    buttonNuevaBusqueda: {
        flex: 0.5,
        borderColor: '#eee',
        borderBottomWidth: 1,
        //position: 'absolute',
        //left: 250,
    },
    buttonVerBusqueda: {
        flex: 0.5,
        borderColor: '#eee',
        borderBottomWidth: 1,
        //position: 'absolute',
        //left: 250,
    },
    viewGuardar: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        padding: 6,
    },
    buttomGuardar: {
        padding: 6,
        borderColor: '#eee',
        borderBottomWidth: 1,
        //position: 'absolute',
        //left: 250,
    },
    input: {
        marginBottom: 10,
        marginTop: 10,
        //marginLeft: 15,
        //marginRight: 15,
        height: 40,
        borderColor: '#c7d6db',
        borderWidth: 1,
        //borderRadius: 20,
        padding: 6,
    },
    tendencyContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 160,
        height: 195,
        backgroundColor: '#F3E7E4',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 5,
        margin: 10,
    },
    userName: {
        fontSize: 12,
        position: 'absolute',
        top: 147,
        left: 10,
        color: 'black',
    },
    userImage: {
        width: 150,
        height: 135,
        borderRadius: 10,
    },
    userLikes: {
        flexDirection: 'row',
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
        width: 40,
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    textLikes: {
        color: 'white',
        marginLeft: 3,
    },
    textLocation: {
        fontSize: 10,
        position: 'absolute',
        bottom: 5,
        left: 10,
    },
});

export default styles;