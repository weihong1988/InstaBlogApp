import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, Image } from "react-native";
import { commonStyles } from "../styles/commonStyles";

import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_ALLPOSTS = "https://weihong1988.pythonanywhere.com/posts";
const IMAGE_URL = "https://weihong1988.pythonanywhere.com/static/";

export default function IndexScreen({ navigation }) {
  const [imageArray, setImageArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const screenWidth = Dimensions.get("window").width - 48 - 4*2;
  const numColumns = 2;
  const tileSize = screenWidth / numColumns;

  // Draw the custom headers on the top header bar
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Create')}>
          <MaterialCommunityIcons name="image-edit" size={40} color="white" style={{marginRight: 20,}} />
        </TouchableOpacity>
      ),
    });
  });

  async function getPosts() {
    setIsLoading(true);
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await axios.get(API_ALLPOSTS, {
        headers: { Authorization: `JWT ${token}` },
      });

      setImageArray(response.data);

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
      getPosts();
    });

    getPosts();

    return removeListener;
  }, []);

  function signOut() {
    AsyncStorage.removeItem("token");

    navigation.navigate('AuthStack', { screen: 'SignIn' });
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity onPress={() => {navigation.navigate("Show", item)}}>
        <Image source={{ uri: IMAGE_URL + item.image }} style={{ width: tileSize, height: tileSize, margin: 2, borderColor: "black", borderWidth: 2, }} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={commonStyles.container}>
      { isLoading ? (<ActivityIndicator size="large" color="#0000ff" />) : 
      (<FlatList style={styles.list} data={imageArray} renderItem={renderItem} numColumns={numColumns} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
    height: "100%",
  }, 
});
