import React from "react";
import { useState, useEffect } from "react";
import { ActivityIndicator, Image, Platform , View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";

import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { loginStyles } from "../styles/loginStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_LOGIN = "https://weihong1988.pythonanywhere.com/auth";
const API_SIGNUP = "https://weihong1988.pythonanywhere.com/newuser";

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = React.useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = React.useState(false);

  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = React.useState(false);

  const [imageData, setImageData] = useState(null);
  const [ProfilePicError, setProfilePicError] = React.useState(false);

  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        await ImagePicker.requestCameraPermissionsAsync();
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

  async function SignUp() {
    var ErrorFound = false;
    Keyboard.dismiss();

    if (username == "") {
      setUsernameError(true);
      setErrorText("Username cannot be blank");
      ErrorFound = true;
    }
    else
      setUsernameError(false);

    if (password == "") {
      setPasswordError(true);
      setErrorText("Password cannot be blank");
      ErrorFound = true;
    }
    else
      setPasswordError(false);

    if (nickname == "") {
      setNicknameError(true);
      setErrorText("Nickname cannot be blank");
      ErrorFound = true;
    }
    else
      setNicknameError(false);

    if (imageData == null) {
      setProfilePicError(true);
      setErrorText("Profile Picture cannot be blank");
      ErrorFound = true;
    }
    else
      setProfilePicError(false);

    if (!ErrorFound) {
      try {
        var response;
        setLoading(true);

        response = await axios.post(API_SIGNUP, {
          username,
          password,
          nickname,
          imageData,
        });

        response = await axios.post(API_LOGIN, {
          username,
          password,
        });

        await AsyncStorage.setItem("token", response.data.access_token);
        setLoading(false);

        navigation.navigate('MainNav', { screen: 'Account' });
      } 
      catch (error) {
        setLoading(false);

        if (error.response.status == 422)
          setErrorText("User already exists");
        else if (error.response.status == 401)
          setErrorText("Invalid username or password");
        else
          setErrorText(error.response.data);
      }
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={loginStyles.container}>
        <Text style={loginStyles.title}>Register new account</Text>

        <Text style={loginStyles.fieldTitle}>Username</Text>
        <TextInput style={loginStyles.input} autoCapitalize="none" autoCorrect={false} value={username} onChangeText={(input) => setUsername(input)} underlineColorAndroid={usernameError ? "red" : "transparent"} />
        
        <Text style={loginStyles.fieldTitle}>Password</Text>
        <TextInput style={loginStyles.input} autoCapitalize="none" autoCompleteType="password" autoCorrect={false} secureTextEntry={true} value={password} onChangeText={(input) => setPassword(input)} underlineColorAndroid={passwordError ? "red" : "transparent"} />
        
        <Text style={loginStyles.fieldTitle}>Display Name</Text>
        <TextInput style={loginStyles.input} autoCapitalize="none" autoCorrect={false} value={nickname} onChangeText={(input) => setNickname(input)} underlineColorAndroid={nicknameError ? "red" : "transparent"} />
 
        <Text style={loginStyles.fieldTitle}>Display Pic</Text>
        <View style={{flexDirection:"row", justifyContent: "space-between"}}>
          <View style={{width: 130, height: 130, borderWidth: 3, borderColor: ProfilePicError ? "red" : "black", alignItems: 'center', justifyContent: 'center',}} >
            {imageData == null ?
              <MaterialCommunityIcons name="face" size={72} color="black" /> :
              <Image source={{ uri: 'data:image/jpeg;base64,' + imageData }} style={{ width: 120, height: 120 }} borderRadius={60} />}
          </View>
          <TouchableOpacity style={styles.CameraButton} onPress={LaunchCamera}>
            <MaterialCommunityIcons name="camera-plus" size={72} color="black" />
          </TouchableOpacity>
        </View>
        
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <TouchableOpacity onPress={SignUp} style={loginStyles.loginButton}>
            <Text style={loginStyles.buttonText}>Register</Text>
          </TouchableOpacity>
          {loading ? (<ActivityIndicator style={{ marginLeft: 20, marginBottom: 20 }} size="large" color="#0000ff" />) : null}
        </View>
        
        <Text style={loginStyles.errorText}>{errorText}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  CameraButton: {
    alignSelf: 'center',
    marginLeft: '10%',
    borderRadius: 10,
    marginRight: 50
  },
});
