import React, { Component } from "react";
import { fetchUser } from "../redux/actions";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }

    render() {
        const { currentUser } = this.props;
        console.log(currentUser);
        if (!currentUser) {
            return <View style={{ flex: 1, justifyContent: "center" }}></View>;
        }
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={{ textAlign: "center" }}>
                    Hello {currentUser.name}
                </Text>
            </View>
        );
    }
}

const mapStoreToState = (store) => ({
    currentUser: store.userState.currentUser
});
const mapDispatchToProps = (dispatch) =>
    bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStoreToState, mapDispatchToProps)(Main);
