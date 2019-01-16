import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        // justifyContent: 'flex-start',
        // 'center', 'flex-start', 'flex-end'
        // 'space-around', 'space-between', 'space-evenly', strech, baseline
        // alignItems: "flex-start", // 'center', 'flex-start', 'flex-end', 'stretch', baseline,
        paddingTop: 10,
    },
    header: {
        flex: 0.15,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        marginTop: 5,
    },
    main: {
        flex: 0.85,
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        marginTop: 5,
    },
    tendencyContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#F3E7E4',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        // borderRadius: 10,
        // paddingHorizontal: 12,
        // paddingVertical: 5,
        margin: 5,
    },
    sbutton: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        padding: 6,
    },
    button: {
        padding: 6,
        borderColor: '#eee',
        borderBottomWidth: 1,
        // position: 'absolute',
        // left: 30,
        // width: 150,
    },
    name: {
        height: 40,
        padding: 10,
    },
    icon: {
        backgroundColor: '#F3E7E4',
    },
});

export default styles;