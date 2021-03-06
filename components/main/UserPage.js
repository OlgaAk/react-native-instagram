import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, FlatList, Button } from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";

const UserPage = (props) => {
    const { currentUser, posts, following } = props;
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [userFollowing, setUserFollowing] = useState([]);

    useEffect(() => {
        let id = props.route.params.user.id;
        if (currentUser.id != id) {
            setUser(props.route.params.user);
            fetchPosts(id);
            fetchFollowing(id);
            if (following.includes(id)) setIsFollowing(true);
        } else props.navigation.navigate("Profile");
    }, [props]);

    const fetchPosts = (uid) => {
        firebase
            .firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc") // new posts first
            .get()
            .then((snapshot) => {
                console.log("__________________________");
                let posts = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    const id = doc.id; // id is not in data, should be taken separately
                    return { id, ...data };
                });
                setUserPosts(posts);
            });
    };

    const fetchFollowing = (uid) => {
        firebase
            .firestore()
            .collection("following")
            .doc(uid)
            .collection("userFollowing")
            .get()
            .then((snapshot) => {
                console.log("__________________________");
                let following = snapshot.docs.map((doc) => {
                    return doc.id;
                });
                setUserFollowing(following);
            });
    };

    const onFollow = () => {
        firebase
            .firestore()
            .collection("following")
            .doc(currentUser.id)
            .collection("userFollowing")
            .doc(user.id)
            .set({}) // empty object because we only need id
            .then(() => {
                setIsFollowing(true);
            });
    };

    const onUnFollow = () => {
        firebase
            .firestore()
            .collection("following")
            .doc(currentUser.id)
            .collection("userFollowing")
            .doc(user.id)
            .delete()
            .then(() => {
                setIsFollowing(false);
            });
    };

    const renderItem = ({ item }) => (
        <View style={styles.containerImage}>
            <Image style={styles.image} source={{ uri: item.imageUrl }} />
        </View>
    );

    if (user) {
        // initially user is undefined
        return (
            <View style={styles.container}>
                <View style={styles.containerInfo}>
                    <Text>{user.name}</Text>
                    <Text>{user.email}</Text>
                    <Text>Following: {userFollowing.length}</Text>
                    {
                        <View>
                            {isFollowing ? (
                                <Button
                                    style={styles.followButton}
                                    title="Following"
                                    onPress={() => onUnFollow()}
                                />
                            ) : (
                                <Button
                                    style={styles.followButton}
                                    title="Follow"
                                    onPress={() => onFollow()}
                                />
                            )}
                        </View>
                    }
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
    image: { flex: 1, aspectRatio: 1 / 1 },
    followButton: {
        width: 20,
        height: 10
    }
});

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
});

export default connect(mapStateToProps, null)(UserPage);
