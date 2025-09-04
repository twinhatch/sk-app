/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    Alert,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import styles from './StyleProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from '../../Helpers/constant';
import { Avatar } from 'react-native-paper';
import Spinner from '../../Component/Spinner';
import CustomToaster from '../../Component/CustomToaster';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { socket } from '../../../utils';
import { Context, UserContext } from '../../../App';
import { useRoute } from '@react-navigation/native';
import { GetApi, Post } from '../../Helpers/Service';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Support = props => {
    const route = useRoute();
    const locationId = route?.params?.locationId;

    const [initial, setInitial] = useContext(Context);
    const [toast, setToast] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [connection, setConnection] = useState({});

    const [refreshing, setRefreshing] = React.useState(false);
    const [userId, setUserId] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [user, setUser] = useContext(UserContext);

    useEffect(() => {
        getSupport(true);
        return () => {

            // socket.off('messages');
            // socket.off('updateConnection');
            // socket.off('allmessages');

        };
    }, [user]);

    const getSupport = (type) => {
        // setLoading(true);
        const data = {
            support_id: `${user._id}admin`,
            userId: user._id,
        };
        Post('create-support', data, { ...props, setInitial }).then(
            async res => {
                console.log(res);
                setLoading(false);
                setConnection(res.data);
                // socket.on('connect', () => {
                if (type && user?._id) {
                    socket.emit('join', `${user?._id}admin`);
                    // socket.emit('join', { support_id: `${user._id}admin`, key: 'userSocket' });
                    console.log('hguguug', socket.id);
                    getChat();
                }

                // });
            },
            err => {
                setLoading(false);
                console.log(err);
            },
        );
    };

    useEffect(() => {
        // socket.on('connect', () => {
        //     console.log('hguguug', socket.id);
        //     // alert(socket.id);
        // });
        console.log(user);

        socket.on('connect', () => {
            socket.emit('join', `${user._id}admin`);
            // socket.emit('joinRoom', { support_id: `${user._id}admin`, key: 'userSocket' });
            // socket.emit('join', { id: user._id });
            console.log('hguguug', socket.id);

            // alert(socket.id);
        });
        if (user) {
            getChat();
        }
        return () => {

            socket.off('join', () => { });
            socket.off('messages');
            socket.off('updateConnection');
            socket.off('allmessages');
            socket.on('disconnect', () => {
                console.log('Disconnected from server');
            });
        };
    }, []);

    useEffect(() => {
        // socket.on('connect', () => {
        //   console.log('Connected to Socket.io Server');
        // });

        socket.on('error', error => {
            console.error('Socket.io Error:', error);
        });

        socket.on('messages', message => {
            // console.log(message)
            if (message.length > 0) {
                setMessages(message);
            }
        });
        socket.on('updateConnection', message => {
            // console.log(message)
            // setMessages(message);
            getSupport(false);
        });

        socket.on('allmessages', message => {
            console.log('mymessage==========>', message[0]);
            // if (message[0].support_user === `6544ccf960fe2c0d7fe3d23a${user._id}`) {
            setMessages(message);
            // }
        });
    }, [socket]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getChat();
        setRefreshing(false);
        // if (locationId) {
        //     fetchNotificationData(locationId);
        // }
    }, []);

    const getChat = () => {
        const payloads = {
            support_id: `${user._id}admin`,
        };
        socket.emit('getsupportMessages', payloads);
    };

    const createChat = message => {
        const payloads = {
            receiver: '6544ccf960fe2c0d7fe3d23a',
            message: newMessage,
            sender: user._id,
            support_id: `${user._id}admin`,
            connection: connection._id,
            key: 'adminSocket',
            userId: user._id,
        };
        console.log(payloads);
        socket.emit('createSupportMessage', payloads);
        setNewMessage('');
    };

    const satisfied = (type, message) => {
        const payloads = {
            type,
            support_id: `${user._id}admin`,
            receiver: '6544ccf960fe2c0d7fe3d23a',
            message,
            sender: user._id,
            connection: connection._id,
            key: 'adminSocket',
        };
        console.log(payloads);
        socket.emit('satisfied', payloads);
        // setNewMessage('');
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
                    <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons
                            name="arrow-back"
                            size={25}
                            color={Constants.black}
                            onPress={() => {
                                props.navigation.goBack();
                            }}
                        />
                    </View>

                    <View style={[{ flex: 10 }, styles.center]}>
                        <Text
                            style={{ color: Constants.black, fontSize: 24, fontWeight: '700', minWidth: 200, textAlign: 'center', fontFamily: 'Helvetica' }}>
                            Support Team
                        </Text>
                    </View>
                    <View style={{ flex: 2 }}></View>
                </View>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    <View>
                        <Text style={styles.chatHeading}>May I help you?</Text>
                    </View>

                    <View style={styles.chatContainer}>
                        <View style={{ flex: 1, flexDirection: 'column', margin: 10 }}>
                            {messages.map((message, idx) => (
                                <View
                                    key={idx}
                                    style={{
                                        alignSelf:
                                            message?.sender?._id === user._id
                                                ? 'flex-end'
                                                : 'flex-start',
                                        marginVertical: 5,
                                        flexDirection: 'column',
                                        maxWidth: '60%',
                                        flex: 1
                                    }}>
                                    {/* {message.sender._id === userId && (
                      <Text
                        style={{
                          color: Constants.black,
                          fontSize: 16,
                          fontWeight: 'bold',
                          marginVertical: 5,
                        }}>
                        {message.sender.fullName}
                      </Text>
                    )} */}
                                    <View
                                        style={{
                                            backgroundColor:
                                                message?.sender?._id === user._id
                                                    ? Constants.pink
                                                    : Constants.lightTraveller,
                                            // ? Constants.grey
                                            // : Constants.blue,
                                            padding: 5,
                                            borderRadius: 10,
                                            borderBottomLeftRadius:
                                                message?.sender?._id !== user._id ? 0 : 10,
                                            borderBottomRightRadius:
                                                message?.sender?._id === user._id ? 0 : 10,
                                            borderWidth: 1,
                                            borderColor:
                                                message?.sender?._id === user._id
                                                    ? Constants.red
                                                    : Constants.yellow,
                                        }}>
                                        <Text
                                            style={{
                                                color: Constants.black,
                                                fontSize: 16,
                                                padding: 5,
                                                maxWidth: '100%',
                                                fontFamily: 'Helvetica'
                                                // flex: 1,
                                                // maxWidth: '50%'
                                            }}>
                                            {message.message}
                                        </Text>
                                        {idx === 0 && message.message === ' Are you satisfied with the resolution ?' && !connection?.satisfied && <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'flex-end' }}>
                                            <TouchableOpacity
                                                onPress={() => { satisfied(true, 'Yes'); }}
                                                style={{
                                                    padding: 5,
                                                    backgroundColor: Constants.green,
                                                    borderRadius: 10,
                                                    width: 50,
                                                }}>
                                                <Text style={{ color: Constants.white, fontSize: 16, textAlign: 'center', fontFamily: 'Helvetica' }}>
                                                    Yes
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => { satisfied(false, 'No'); }}
                                                style={{
                                                    padding: 5,
                                                    backgroundColor: Constants.red,
                                                    borderRadius: 10,
                                                    width: 50,
                                                }}>
                                                <Text style={{ color: Constants.white, fontSize: 16, textAlign: 'center', fontFamily: 'Helvetica' }}>
                                                    No
                                                </Text>
                                            </TouchableOpacity>
                                        </View>}
                                    </View>
                                    <Text
                                        style={{
                                            alignSelf:
                                                message?.sender?._id === user._id
                                                    ? 'flex-end'
                                                    : 'flex-start',
                                            color: Constants.black,
                                            fontSize: 10,
                                            marginTop: 3,
                                            fontWeight: 'bold',
                                            fontFamily: 'Helvetica'
                                        }}>
                                        {new Date(message.msgtime).toLocaleString()}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 10,
                    marginBottom: 10,
                }}>
                <TextInput
                    style={{
                        flex: 1,
                        height: 40,
                        borderColor: Constants.grey,
                        borderWidth: 2,
                        borderRadius: 20,
                        paddingHorizontal: 15,
                        marginRight: 10,
                        color: Constants.black,
                        fontFamily: 'Helvetica'
                        // backgroundColor: Constants.white,
                    }}
                    placeholder="Type your message..."
                    value={newMessage}
                    onChangeText={text => setNewMessage(text)}
                />
                <TouchableOpacity
                    onPress={createChat}
                    disabled={newMessage.length === 0}
                    style={{
                        padding: 15,
                        backgroundColor: Constants.red,
                        borderRadius: 20,
                    }}>
                    <Text style={{ color: Constants.white, fontSize: 16, fontFamily: 'Helvetica' }}>
                        <Ionicons name="send-sharp" />
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Support;
