import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, View, TouchableOpacity, Image, Keyboard, ScrollView } from "react-native";
import { commonStyles } from "../styles/commonStyles";

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_MODIFYPOST = "https://weihong1988.pythonanywhere.com/post";
const IMAGE_URL = "https://weihong1988.pythonanywhere.com/static/";

export default function EditScreen({ route, navigation }) {
  const posts = route.params;
  const imageURL = posts.image;

  const [Title, setTitle] = useState(posts.title);
  const [TitleError, setTitleError] = React.useState(false);

  const [imageData, setImageData] = useState(null);

  const [Description, setDescription] = useState(posts.description);

  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submitPost() {
    var ErrorFound = false;
    Keyboard.dismiss();

    if (Title == "") {
      setTitleError(true);
      setErrorText("Title cannot be blank");
      ErrorFound = true;
    }
    else
      setTitleError(false);

    if (!ErrorFound) {
      try {
        setIsLoading(true);

        const token = await AsyncStorage.getItem("token");

        if (imageData == null)
        {
          const response = await axios.put(API_MODIFYPOST + "/" + posts.id, 
            {
              Title,
              Description
            },
            {
            headers: { Authorization: `JWT ${token}` },
            }
          );
        }
        else
        {
          const response = await axios.put(API_MODIFYPOST + "/" + posts.id, 
            {
              Title,
              imageData,
              Description
            },
            {
            headers: { Authorization: `JWT ${token}` },
            }
          );
        }

        setIsLoading(false);

        navigation.navigate('Index');
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
  }

  async function deletePost() {
    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.delete(API_MODIFYPOST + "/" + posts.id, { headers: { Authorization: `JWT ${token}` }, });

      setIsLoading(false);
      navigation.navigate('Index');
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

  function signOut() {
    AsyncStorage.removeItem("token");

    navigation.navigate('AuthStack', { screen: 'SignIn' });
  }

  const LaunchCamera = async () => {
    var cameraResponse = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (cameraResponse.cancelled) {
      return;
    }

    const FormattedImage = await ImageManipulator.manipulateAsync(
      cameraResponse.localUri || cameraResponse.uri,
      [{resize: { width: 1000, height: 1000, }}],
      {compress: 0.9, base64: true}
    );

    setImageData(FormattedImage.base64);
  };

  const LaunchGallery = async () => {
    var galleryResponse = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (galleryResponse.cancelled) {
      return;
    }

    const FormattedImage = await ImageManipulator.manipulateAsync(
      galleryResponse.localUri || galleryResponse.uri,
      [{resize: { width: 1000, height: 1000, }}],
      {compress: 0.9, base64: true}
    );

    setImageData(FormattedImage.base64);
  };

  return (
    <View style={commonStyles.BlogContainer}>
      { isLoading ? 
      (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView>
          <Text style={[commonStyles.title, {marginBottom: 20,}]}>Changed your mind?</Text>

          <Text style={commonStyles.subTitle}>Title</Text>
          <TextInput style={commonStyles.input} autoCapitalize="sentences" value={Title} onChangeText={(input) => setTitle(input)} underlineColorAndroid={TitleError ? "red" : "transparent"} />
        
          <Text style={commonStyles.subTitle}>Picture</Text>
          <View style={commonStyles.imageContainer}>
            { imageData == null ?
                (<Image source={{ uri: IMAGE_URL + imageURL }} style={commonStyles.image} />) :
                (<Image source={{ uri: 'data:image/jpeg;base64,' + imageData }} style={commonStyles.image} />)
            }
            <View style={{justifyContent: "space-between"}}>
              <TouchableOpacity style={commonStyles.iconButton} onPress={LaunchCamera}>
                <MaterialCommunityIcons name="camera-plus" size={72} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={commonStyles.iconButton} onPress={LaunchGallery}>
                <MaterialCommunityIcons name="image-search" size={72} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={commonStyles.subTitle}>Description</Text>
          <TextInput style={[commonStyles.input, {height: 80}]} multiline={true} textAlignVertical="top" autoCapitalize="sentences" value={Description} onChangeText={(input) => setDescription(input)} />
        
          <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 10}}>
            <TouchableOpacity onPress={submitPost} style={commonStyles.actionButton}>
              <Text style={commonStyles.buttonText}>Modify</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={deletePost} style={commonStyles.deleteButton}>
              <Text style={commonStyles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>

          <Text style={commonStyles.errorText}>{errorText}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
