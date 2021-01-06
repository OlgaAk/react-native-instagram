import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE } from "../constants";
import * as firebase from "firebase";
import "firebase/firestore";

export function fetchUser() {
    return (dispatch) => {
        firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    const data = snapshot.data();
                    const id = snapshot.id;
                    let user = { id, ...data };
                    dispatch({
                        type: USER_STATE_CHANGE,
                        currentUser: user
                    });
                } else {
                    console.log("User does not exist");
                }
            });
    };
}

export function fetchUserPosts() {
    return (dispatch) => {
        firebase
            .firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
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
                console.log(posts);
                dispatch({
                    type: USER_POSTS_STATE_CHANGE,
                    posts: posts
                });
            })
            .catch((error) => {
                console.log("Posts do not exist");
            });
    };
}
