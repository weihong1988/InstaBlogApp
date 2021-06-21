import React from "react";
import { useState, useEffect } from "react";
import { ActivityIndicator, View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";

import { loginStyles } from "../styles/loginStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_LOGIN = "https://weihong1988.pythonanywhere.com/auth";

export default function SignInScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  function SignUp() {
    navigation.navigate("SignUp");
  }

  async function login() {
    Keyboard.dismiss();

    try {
      setLoading(true);

      const response = await axios.post(API_LOGIN, {
        username,
        password,
      });

      await AsyncStorage.setItem("token", response.data.access_token);
      setLoading(false);

      navigation.navigate('MainNav', { screen: 'Account' });
    } 
    catch (error) {
      setLoading(false);

      if (error.response.status == 401)
        setErrorText("Invalid username or password");
      else
        setErrorText(error.response.data.description);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={loginStyles.container}>
        <Text style={loginStyles.title}>Sign in to blog</Text>
        <Text style={loginStyles.fieldTitle}>Username</Text>
        <TextInput
          style={loginStyles.input}
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={(input) => setUsername(input)}
        />
        <Text style={loginStyles.fieldTitle}>Password</Text>
        <TextInput
          style={loginStyles.input}
          autoCapitalize="none"
          autoCompleteType="password"
          autoCorrect={false}
          secureTextEntry={true}
          value={password}
          onChangeText={(input) => setPassword(input)}
        />

        <TouchableOpacity onPress={SignUp} style={loginStyles.SignUpButton}>
          <Text style={loginStyles.SignUpText}>Register a new account</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={login} style={loginStyles.loginButton}>
            <Text style={loginStyles.buttonText}>Log in</Text>
          </TouchableOpacity>
          {loading ? (<ActivityIndicator style={{ marginLeft: 20, marginBottom: 20 }} size="large" color="#0000ff" />) : null}
        </View>    
        <Text style={loginStyles.errorText}>{errorText}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({});
