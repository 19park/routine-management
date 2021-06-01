import 'react-native-gesture-handler';
import React from 'react';
import Navigation from './navigation/navigation';
import {Provider} from 'react-redux';
import {store} from './stores';
import {enableScreens} from 'react-native-screens';

enableScreens();

const App = () => {
    return (
        <>
            <Provider store={store}>
                <Navigation/>
            </Provider>
        </>
    );
};

export default App;
