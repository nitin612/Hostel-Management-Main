import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { alaBaster, black, lightGray, primaryBlue, white } from '../../../constants/Colors';
import { Button } from 'react-native-paper';

const Notifications = ({ navigation }) => {
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ backgroundColor: white, minHeight: '100%' }} showsVerticalScrollIndicator={false} >
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <Text>Hello Notifications</Text>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: alaBaster
    },
    contentContainer: {
        flex: 1,
        width: '90%',
        alignItems: 'center',
    },
    title: {
        width: '90%',
        fontFamily: 'Roboto Regular',
        fontSize: 16,
        marginVertical: 10,
    },
})

export default Notifications