import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity
} from "react-native";
import firebase from "firebase";
import UserPage from "./UserPage";

require("firebase/firestore");

import { createStackNavigator } from "@react-navigation/stack";

const SearchStack = createStackNavigator();

export default function SearchStackScreen() {
    return (
        <SearchStack.Navigator>
            <SearchStack.Screen name="Search" component={Search} />
            <SearchStack.Screen name="UserPage" component={UserPage} />
        </SearchStack.Navigator>
    );
}

export function Search({ navigation }) {
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
                onPress={() => {
                    console.log(item);
                    navigation.navigate("UserPage", {
                        user: item,
                        navigation: navigation
                    });
                }}
            >
                <Text>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
    }
});
