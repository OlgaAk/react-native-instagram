import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, FlatList } from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";

const Profile = (props) => {
    let routeParams = props.route.params;
    console.log(props.route);
    const { currentUser, posts } = props;
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);

    if (routeParams) {
        // solves issue with ussefect not accepting undefined if navigated directly with no params
        console.log(routeParams);
    } else {
        routeParams = {};
    }

    useEffect(() => {
        setUser(currentUser);
        setUserPosts(posts);
        // if navigated from search
        if ("user" in routeParams) {
            // if searched profile is different from current user
            if (currentUser.id != routeParams.user.id) {
                setUser(routeParams.user);
                fetchPosts(routeParams.user.id);
            }
        }
    }, [routeParams]);

    const fetchPosts = (uid) => {
        firebase
            .firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                console.log("__________________________");
                let posts = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data };
                });
                setUserPosts(posts);
            });
    };

    const renderItem = ({ item }) => (
        <View style={styles.containerImage}>
            <Image style={styles.image} source={{ uri: item.imageUrl }} />
        </View>
    );

    if (user) {
        return (
            <View style={styles.container}>
                <View style={styles.containerInfo}>
                    <Text>{user.name}</Text>
                    <Text>{user.email}</Text>
                </View>
                <View style={styles.containerGallery}>
                    <FlatList
                        numColumns={3}
                        horizontal={false}
                        data={userPosts}
                        renderItem={renderItem}
                    />
                </View>
            </View>
        );
    } else {
        return <View />;
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
    },
    containerInfo: {
        margin: 10
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3
    },
    image: { flex: 1, aspectRatio: 1 / 1 }
});

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts
});

export default connect(mapStateToProps, null)(Profile);
