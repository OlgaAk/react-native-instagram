import React from "react";
import { StyleSheet, View, Text, Image, FlatList } from "react-native";
import { connect } from "react-redux";

function Profile(props) {
    const { currentUser, posts } = props;
    return (
        <View style={styles.container}>
            <Text>{currentUser.name}</Text>
            <Text>{posts[0].imageUrl}</Text>
            <Image style={styles.image} source={{ uri: posts[0].imageUrl }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
    },
    image: { flex: 0.2 }
});

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts
});

export default connect(mapStateToProps, null)(Profile);
