import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
    const [user, setUser] = useState(null);
    useEffect(async () => {
        await doGetUser();
    }, []);

    const doGetUser = async () => {
        const getInfos = await AsyncStorage.getItem('user_infos');
        const parseInfos = JSON.parse(getInfos);
        setUser(parseInfos.user);
    };
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1, padding: 16}}>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: 20,
                            textAlign: 'center',
                            marginBottom: 16,
                        }}>
                        메인화면
                        {'\n\n'}
                        {JSON.stringify(user)}
                    </Text>
                </View>
                <Text
                    style={{
                        fontSize: 18,
                        textAlign: 'center',
                        color: 'grey',
                    }}>
                    로그인 후 화면진입
                </Text>
                <Text
                    style={{
                        fontSize: 16,
                        textAlign: 'center',
                        color: 'grey',
                    }}>
                    19park
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;
