
if (__DEV__) {
    require("./ReactotronConfig");
}

import React from 'react';
import { LoggedInProvider } from './src/features/login/providers/LoggedInProvider';
import { LoginScreen } from './src/features/login/screens/LoginScreen';

function App() {


    return (
        <LoggedInProvider>
            <LoginScreen />
        </LoggedInProvider>
    );
}

export default App;
