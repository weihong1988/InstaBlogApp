import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from "react-native";
import { commonStyles } from "../styles/commonStyles";

import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_GETUSER = "https://weihong1988.pythonanywhere.com/getuser";

export default function ShowScreen({ route, navigation }) {
  const posts = route.params;
  const screenWidth = Dimensions.get("window").width - 48;
  const postDateTime = new Date(posts.createdAt * 1000);
  const postDateTimeString = postDateTime.toDateString() + ' ' + postDateTime.toLocaleTimeString('en-US');

  const [nickname, setNickname] = useState("");
  const [profilePic, setprofilePic] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  // Draw the custom headers on the top header bar
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Edit', posts)}>
          <MaterialCommunityIcons name="file-document-edit" size={40} color="white" style={{marginRight: 20,}} />
        </TouchableOpacity>
      ),
    });
  });

  async function getUser() {
    setIsLoading(true);
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await axios.get(API_GETUSER + '/' + posts.createdUser, {
        headers: { Authorization: `JWT ${token}` },
      });

      setNickname(response.data.nickname);
      setprofilePic(response.data.profilePic);

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

  useEffect(() => { getUser(); }, []);

  function signOut() {
    AsyncStorage.removeItem("token");

    navigation.navigate('AuthStack', { screen: 'SignIn' });
  }




  return (
    <View style={commonStyles.BlogContainer}>
      { isLoading ? 
      (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View>
          <View style={{flexDirection: "row", alignItems: "center", marginBottom: 10,}}>
            <Image source={{ uri: 'data:image/jpeg;base64,' + profilePic }} style={{ width: 80, height: 80 }} borderRadius={40} />
            <View>
              <Text style={[commonStyles.title, {marginLeft: 20}]}>{nickname}</Text>
              <Text style={styles.postDateTime}>Posted on: {postDateTimeString}</Text>
            </View>
            
          </View>

          <Text style={[commonStyles.title, {textDecorationLine: "underline"}]}>{posts.title}</Text>
          <Image source={{ uri: 'data:image/jpeg;base64,' + posts.image }} style={{ width: screenWidth, height: screenWidth }} />
          <Text style={commonStyles.descriptionText}>{posts.description}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  postDateTime: {
    marginLeft: 20,
    fontSize: 16,
    fontStyle: "italic",
  }
});
