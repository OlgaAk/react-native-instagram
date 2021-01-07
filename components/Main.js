import React, { Component } from "react";
import {
    fetchUser,
    fetchUserPosts,
    fetchUserFollowing
} from "../redux/actions";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import FeedScreen from "./main/Feed";
import ProfileScreen from "./main/Profile";
import SearchScreen from "./main/Search";

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return null;
};

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
    }

    render() {
        return (
            <Tab.Navigator
                initialRouteName="Feed"
                labeled={false}
                barStyle={{ backgroundColor: "#fff" }}
            >
                <Tab.Screen
                    name="Feed"
                    component={FeedScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="home"
                                color={color}
                                size={26}
                            />
                        )
                    }}
                />
                <Tab.Screen
                    name="Search"
                    component={SearchScreen}
                    navigation={this.props.navigation}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="magnify"
                                color={color}
                                size={26}
                            />
                        )
                    }}
                />

                <Tab.Screen
                    name="Add "
                    component={EmptyScreen} //to make project compile, add component is needed not here but in app.js
                    listeners={({ navigation }) => ({
                        tabPress: (event) => {
                            event.preventDefault(); //don't show tabbar
                            navigation.navigate("Add"); // navigation logic in app.js
                        }
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="plus-box"
                                color={color}
                                size={26}
                            />
                        )
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons
                                name="account-circle"
                                color={color}
                                size={26}
                            />
                        )
                    }}
                />
            </Tab.Navigator>
        );
    }
}

const mapStoreToState = (store) => ({
    currentUser: store.userState.currentUser
});
const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        { fetchUser, fetchUserPosts, fetchUserFollowing },
        dispatch
    );

export default connect(mapStoreToState, mapDispatchToProps)(Main);
