import React, { Component } from "react";
import { fetchUser } from "../redux/actions";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import FeedScreen from "./main/Feed";

const Tab = createBottomTabNavigator();

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        return (
            <Tab.Navigator>
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
            </Tab.Navigator>
        );
    }
}

const mapStoreToState = (store) => ({
    currentUser: store.userState.currentUser
});
const mapDispatchToProps = (dispatch) =>
    bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStoreToState, mapDispatchToProps)(Main);
