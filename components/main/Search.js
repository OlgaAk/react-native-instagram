import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity
} from "react-native";
import firebase from "firebase";
require("firebase/firestore");

export default function Search(props) {
    const [users, setUsers] = useState([]);
    const fetchUsers = (search) => {
        if (search) {
            firebase
                .firestore()
                .collection("users")
                .where("name", ">=", search) // shows all users that come alphabetically later. contains or beginswith is not supported
                .get()
                .then((snapshot) => {
                    let users = snapshot.docs.map((doc) => {
                        console.log(doc.data());
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data };
                    });
                    setUsers(users);
                });
        } else {
            setUsers([]);
        }
    };
    const searchItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={props.navigation.navigate("Profile", { item })}
            >
                <Text>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View>
            <TextInput
                placeholder="Search"
                onChangeText={(search) => fetchUsers(search)}
            ></TextInput>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={searchItem}
            />
        </View>
    );
}
