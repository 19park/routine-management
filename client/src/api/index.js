import {request} from './request';

export const auth = {
    // oauth 가입회원 체크
    checkOauthUser(params) {
        return request({
            method: 'get',
            url: '/auth/oauth/check',
            params
        });
    },
    // 가입
    register(data) {
        return request({
            method: 'post',
            url: '/auth/register',
            data
        });
    },
    // 로그인
    login(data) {
        return request({
            method: 'post',
            url: '/auth/login',
            data
        });
    },
    // 로그아웃
    logout(data) {
        return request({
            method: 'post',
            url: '/auth/logout',
            data
        });
    },
};
