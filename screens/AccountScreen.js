import React, { useState, useEffect } from "react";
import { ActivityIndicator, Image, Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { commonStyles } from "../styles/commonStyles";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_WHOAMI = "https://weihong1988.pythonanywhere.com/whoami";
const IMAGE_URL = "https://weihong1988.pythonanywhere.com/static/";

export default function AccountScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [profilePic, setprofilePic] = useState("");
  const [joinDate, setJoinDate] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  async function getProfile() {
    setIsLoading(true);
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await axios.get(API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });

      let joinDateString = new Date(response.data.createdAt * 1000).toDateString();

      setUsername(response.data.username);
      setNickname(response.data.nickname);
      setprofilePic(response.data.profilePic);
      setJoinDate(joinDateString);

      setIsLoading(false);
    } 
    catch (error) {
      setIsLoading(false);

      if (error.response) {
        if (error.response.status == 401)
          signOut();
        else
          console.log(error.response.data);
      } 
      else
        console.log(error);
    }
  }

  useEffect(() => {
    const removeListener = navigation.addListener("focus", () => {
      getProfile();
    });

    getProfile();

    return removeListener;
  }, []);

  function signOut() {
    AsyncStorage.removeItem("token");

    navigation.navigate('AuthStack', { screen: 'SignIn' });
  }

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>My Profile</Text>
      { isLoading ? (<ActivityIndicator size="large" color="#0000ff" />) : 
      (
        <View style={{alignItems: "center"}}>
          <Image source={{ uri: IMAGE_URL + profilePic }} style={{ width: 200, height: 200, marginTop: 12,}} borderRadius={100} />
          <Text style={[commonStyles.title, {fontStyle: "italic", color: "blue"}]}>{nickname}</Text>
          <Text style={commonStyles.subTitle}>Username: {username}</Text>
          <Text style={commonStyles.subDesc}>Member Since: {joinDate}</Text>
          <TouchableOpacity onPress={signOut} style={styles.SignOutButton}>
            <Text style={styles.SignOutText}>Log out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  SignOutButton: {
    backgroundColor: "red",
    width: 120,
    alignItems: "center",
    padding: 12,
    marginTop: 12,
    marginBottom: 24,
    borderRadius: 20,
  },
  SignOutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
