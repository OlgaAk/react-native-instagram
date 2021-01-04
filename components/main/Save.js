import React, { useState } from "react";
import { View, TextInput, Image, Button } from "react-native";

import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function Save(props) {
    const [caption, setCaption] = useState("");
    const uploadImage = async () => {
        const url = props.route.params.image;
        const childPath = `post/${
            firebase.auth().currentUser.uid
        }/${Math.random().toString(36)}`;
        console.log("childPath " + childPath);
        const response = await fetch(url);
        const blob = await response.blob();
        const task = firebase.storage().ref().child(childPath).put(blob);
        const taskProgress = (snapshot) => {
            console.log("transferred: " + snapshot.bytesTransferred);
        };

        const taskCompleted = () => {
            task.snapshot.ref
                .getDownloadURL()
                .then((imageUrl) => {
                    savePostData(imageUrl);
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        const taskError = (snapshot) => {
            console.log(snapshot);
        };
        task.on("state_changed", taskProgress, taskError, taskCompleted);
    };

    const savePostData = (imageUrl) => {
        firebase
            .firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                imageUrl,
                caption,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                props.navigation.popToTop();
            });
    };

    return (
        <View style={{ flex: 1 }}>
            <Image source={{ uri: props.route.params.image }} />
            <TextInput
                placeholder="Add a caption..."
                onChangeText={(caption) => setCaption(caption)}
            />
            <Button title="Save" onPress={() => uploadImage()} />
        </View>
    );
}
