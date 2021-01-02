import React, { Component } from "react";
import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID
} from "@env";
import { View, Text } from "react-native";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";

const store = createStore(rootReducer, applyMiddleware(thunk));

import * as firebase from "firebase";

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID
};

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login";
import MainScreen from "./components/Main";
import AddScreen from "./components/main/Add";

const Stack = createStackNavigator();

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            loggedIn: false
        };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            console.log(user);
            if (!user) {
                this.setState({
                    loaded: true,
                    loggedIn: false
                });
            } else {
                this.setState({
                    loaded: true,
                    loggedIn: true
                });
            }
        });
    }

    render() {
        const { loaded, loggedIn } = this.state;
        if (!loaded) {
            return (
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={{ textAlign: "center" }}>Loading</Text>
                </View>
            );
        }
        if (!loggedIn) {
            return (
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Landing">
                        <Stack.Screen
                            name="Landing"
                            component={LandingScreen}
                            options={{ headerShown: false }}
                        ></Stack.Screen>
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                        ></Stack.Screen>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                        ></Stack.Screen>
                    </Stack.Navigator>
                </NavigationContainer>
            );
        } else {
            return (
                <Provider store={store}>
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName="Main">
                            <Stack.Screen
                                name="Main"
                                component={MainScreen}
                                options={{ headerShown: false }}
                            ></Stack.Screen>
                            <Stack.Screen
                                name="Add"
                                component={AddScreen}
                            ></Stack.Screen>
                        </Stack.Navigator>
                    </NavigationContainer>
                </Provider>
            );
        }
    }
}
