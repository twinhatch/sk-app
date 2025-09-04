/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import { useContext, useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';
import styles from './StyleProvider';
import Spinner from '../../Component/Spinner';
import CustomToaster from '../../Component/CustomToaster';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from '../../Helpers/constant';
import { List } from 'react-native-paper';
import { GetApi } from '../../Helpers/Service';
import { Context } from '../../../App';

const Faq = props => {
    const [toast, setToast] = useState('');
    const [loading, setLoading] = useState(false);
    const [initial, setInitial] = useContext(Context);
    const [faqdata, setFaqData] = useState([]);

    useEffect(() => {
        getNotification();
    }, []);

    const getNotification = () => {
        setLoading(true);
        GetApi('faq', { ...props, setInitial }).then(
            async res => {
                setLoading(false);
                console.log('Notification ---------->', res);
                if (res.status) {
                    setFaqData(res.data);
                } else {
                    console.log('error------>', res);
                }
            },
            err => {
                setLoading(false);
                console.log(err);
            },
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 80}>
                <Spinner color={'#fff'} visible={loading} />
                <CustomToaster
                    color={Constants.black}
                    backgroundColor={Constants.white}
                    timeout={5000}
                    toast={toast}
                    setToast={setToast}
                />
                <View
                    style={{ flexDirection: 'row', paddingHorizontal: 24, marginTop: 15 }}>
                    <View style={{ flex: 2, flexDirection: 'row' }}>
                        <Ionicons
                            name="arrow-back"
                            size={25}
                            color={Constants.black}
                            onPress={() => {
                                props.navigation.goBack();
                            }}
                        />
                    </View>

                    <View style={[{ flex: 10 }, styles.center, { flexDirection: 'column' }]}>
                        <Text
                            style={{ color: Constants.black, fontSize: 24, fontWeight: '700', minWidth: 150, textAlign: 'center' }}>
                            FAQ
                        </Text>
                        <View>
                            <Text style={[styles.chatHeading, { marginBottom: 20, fontFamily: 'Helvetica' }]}>
                                May I help you?
                            </Text>
                        </View>
                    </View>
                    <View style={{ flex: 2 }} />
                </View>
                <ScrollView>
                    <List.AccordionGroup>
                        {faqdata.map(faq => (
                            <List.Accordion
                                key={faq._id}
                                titleStyle={{ display: 'none' }}
                                description={faq.question}
                                id={faq._id}
                                descriptionStyle={{ color: Constants.black, fontWeight: '700' }}
                                style={{
                                    backgroundColor:
                                        initial === 'traveller'
                                            ? Constants.lightTraveller
                                            : Constants.pink,
                                    gap: 2,
                                }}>
                                <List.Item
                                    description={faq.answer}
                                    titleStyle={{ display: 'none' }}
                                    descriptionNumberOfLines={10}
                                    descriptionStyle={{
                                        maxHeight: 'auto',
                                        height: 'auto',
                                        color: Constants.black,
                                    }}
                                    style={{}}
                                />
                            </List.Accordion>
                        ))}
                    </List.AccordionGroup>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Faq;
