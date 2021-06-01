import React, {useState, useEffect, createRef} from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    ScrollView,
    Image,
    Keyboard,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Loader from '../../components/Loader';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';
import {auth as authApi} from '~/api';

const LoginScreen = ({navigation}) => {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');

    const passwordInputRef = createRef();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '686251110620-lfmp798flv74hb0g6m774q8bvs36dov1.apps.googleusercontent.com',
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
            iosClientId: '', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        });
        // isSignedIn()
    }, []);

    // google login
    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo);
            // setUser(userInfo)
            await doCheckGoogleUser(userInfo);
        } catch (error) {
            console.log('Message', error.message);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User Cancelled the Login Flow');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Signing In');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play Services Not Available or Outdated');
            } else {
                console.log('Some Other Error Happened');
            }
        }
    };

    const doCheckGoogleUser = async userInfo => {
        setLoading(true);
        try {
            const checkUser = await authApi.checkOauthUser({
                oauthId: userInfo.user.id,
            });
            if (checkUser) {
                console.log('checkUser = ', checkUser);
                // 회원가입 된 구글회원 > 로그인 처리
                // await authApi
                //     .login({
                //         email: userEmail,
                //         password: userPassword
                //     })
                //     .then(doLoginResolve)
                //     .catch((error) => {
                //         alert(error.response.data.message);
                //     });
            } else {
                // 회원가입 안 된 구글회원
                navigation.navigate('RegisterScreen', {
                    user: userInfo
                });
            }
        } catch (error) {
            alert('인증서버에 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };
    const isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
            getCurrentUserInfo();
        } else {
            console.log('Please Login');
        }
    };
    const getCurrentUserInfo = async () => {
        try {
            const userInfo = await GoogleSignin.signInSilently();
            // setUser(userInfo);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                alert('User has not signed in yet');
                console.log('User has not signed in yet');
            } else {
                alert('Something went wrong. Unable to get user\'s info');
                console.log('Something went wrong. Unable to get user\'s info');
            }
        }
    };
    const signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            // setUser({}); // Remember to remove the user from your app's state as well
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmitPress = () => {
        setErrortext('');
        if (!userEmail) {
            alert('이메일을 입력해주세요!');
            return;
        }
        if (!userPassword) {
            alert('비밀번호를 입력해주세요!');
            return;
        }
        setLoading(true);
        authApi
            .login({
                email: userEmail,
                password: userPassword
            })
            .then(doLoginResolve)
            .catch((error) => {
                alert(error.response.data.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const doLoginResolve = res => {
        console.log(res);

        AsyncStorage.setItem('user_infos', JSON.stringify(res));
        navigation.replace('DrawerNavigationRoutes');
    };

    return (
        <View style={styles.mainBody}>
            <Loader loading={loading}/>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                <View>
                    <KeyboardAvoidingView enabled>
                        <View style={{alignItems: 'center'}}>
                            <Image
                                source={require('../../assets/images/about.png')}
                                style={{
                                    width: '50%',
                                    height: 100,
                                    resizeMode: 'contain',
                                    margin: 30,
                                }}
                            />
                        </View>
                        <View style={styles.SectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(UserEmail) =>
                                    setUserEmail(UserEmail)
                                }
                                placeholder="이메일을 입력하세요" //dummy@abc.com
                                placeholderTextColor="#8b9cb5"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                                onSubmitEditing={() =>
                                    passwordInputRef.current &&
                                    passwordInputRef.current.focus()
                                }
                                underlineColorAndroid="#f000"
                                blurOnSubmit={false}
                            />
                        </View>
                        <View style={styles.SectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(UserPassword) =>
                                    setUserPassword(UserPassword)
                                }
                                placeholder="비밀번호를 입력하세요" //12345
                                placeholderTextColor="#8b9cb5"
                                keyboardType="default"
                                ref={passwordInputRef}
                                onSubmitEditing={Keyboard.dismiss}
                                blurOnSubmit={false}
                                secureTextEntry={true}
                                underlineColorAndroid="#f000"
                                returnKeyType="next"
                            />
                        </View>
                        {errortext !== '' ? (
                            <Text style={styles.errorTextStyle}>
                                {errortext}
                            </Text>
                        ) : null}
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={0.5}
                            onPress={handleSubmitPress}>
                            <Text style={styles.buttonTextStyle}>로그인</Text>
                        </TouchableOpacity>
                        <View style={styles.containerStyle}>
                            <GoogleSigninButton
                                style={{width: '100%', height: 48}}
                                size={GoogleSigninButton.Size.Wide}
                                color={GoogleSigninButton.Color.Light}
                                onPress={signIn}
                            />
                        </View>
                        <Text
                            style={styles.registerTextStyle}
                            onPress={() => navigation.navigate('RegisterScreen')}>
                            아직 회원이 아니신가요? 회원가입
                        </Text>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </View>
    );
};
export default LoginScreen;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#307ecc',
        alignContent: 'center',
    },
    SectionStyle: {
        flexDirection: 'row',
        height: 40,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
    },
    buttonStyle: {
        backgroundColor: '#7DE24E',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#7DE24E',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 20,
        marginBottom: 15,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    inputStyle: {
        flex: 1,
        color: 'white',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#dadae8',
    },
    containerStyle: {
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
    },
    registerTextStyle: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
});
