import React, { useState, useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard } from "react-native";
import { commonStyles } from "../styles/commonStyles";

import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_WHOAMI = "https://weihong1988.pythonanywhere.com/whoami";
const API_CREATEPOST = "https://weihong1988.pythonanywhere.com/create";

export default function CreateScreen({ navigation }) {
  const [Title, setTitle] = useState("");
  const [TitleError, setTitleError] = React.useState(false);

  const [imageData, setImageData] = useState(null);
  const [imageDataError, setImageDataError] = React.useState(false);

  const [Description, setDescription] = useState("");

  const [errorText, setErrorText] = useState("");
  const [profilePic, setprofilePic] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function getProfile() {
    setIsLoading(true);
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await axios.get(API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });

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

    if (imageData == null) {
      setImageDataError(true);
      setErrorText("Picture cannot be blank");
      ErrorFound = true;
    }
    else
      setImageDataError(false);

    if (!ErrorFound) {
      try {
        setIsLoading(true);

        const token = await AsyncStorage.getItem("token");

        const response = await axios.post(API_CREATEPOST, 
          {
            Title,
            imageData,
            Description
          },
          {
          headers: { Authorization: `JWT ${token}` },
          }
        );

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

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        await ImagePicker.requestCameraPermissionsAsync();
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
    })();
  }, []);

  const LaunchCamera = async () => {
    var cameraResponse = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (cameraResponse.cancelled) {
      return;
    }

    const FormattedImage = await ImageManipulator.manipulateAsync(
      cameraResponse.localUri || cameraResponse.uri,
      [{resize: { width: 300, height: 300, }}],
      {compress: 0.5, base64: true}
    );

    setImageData(FormattedImage.base64);
  };

  const LaunchGallery = async () => {
    var galleryResponse = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (galleryResponse.cancelled) {
      return;
    }

    const FormattedImage = await ImageManipulator.manipulateAsync(
      galleryResponse.localUri || galleryResponse.uri,
      [{resize: { width: 300, height: 300, }}],
      {compress: 0.5, base64: true}
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
          <View>
            <View style={{flexDirection: "row", alignItems: "center", marginBottom: 16,}}>
              <Image source={{ uri: 'data:image/jpeg;base64,' + profilePic }} style={{ width: 100, height: 100 }} borderRadius={50} />
              <Text style={styles.ProfileText}>What's on your mind?</Text>
            </View>

            <Text style={commonStyles.subTitle}>Title</Text>
            <TextInput style={commonStyles.input} autoCapitalize="sentences" value={Title} onChangeText={(input) => setTitle(input)} underlineColorAndroid={TitleError ? "red" : "transparent"} />
          
            <Text style={commonStyles.subTitle}>Picture</Text>
            <View style={commonStyles.imageContainer}>
              { imageData == null ?
                  (<View style={[commonStyles.imagePlaceholder, , {borderColor: imageDataError ? "red" : "#999"}]}></View>) :
                  (<Image source={{ uri: 'data:image/jpeg;base64,' + imageData }} style={[commonStyles.image, {borderColor: imageDataError ? "red" : "#999"}]} />)
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
          
            <TouchableOpacity onPress={submitPost} style={commonStyles.actionButton}>
              <Text style={commonStyles.buttonText}>Post</Text>
            </TouchableOpacity>

            <Text style={commonStyles.errorText}>{errorText}</Text>
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  ProfileText: {
    marginLeft: 20,
    fontWeight: "bold",
    fontSize: 24,
  },
});
