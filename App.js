import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";

import IndexScreen from "./screens/IndexScreen";
import CreateScreen from "./screens/CreateScreen";
import AccountScreen from "./screens/AccountScreen";
import ShowScreen from "./screens/ShowScreen";
import EditScreen from "./screens/EditScreen";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const MasterStack = createStackNavigator();

const AuthStack = createStackNavigator();
const MainNavTab = createBottomTabNavigator();

const BlogStack = createStackNavigator();

function BlogStackComponent() {
  return (
    <BlogStack.Navigator mode="modal" initialRouteName="Index" screenOptions={{
      headerStyle: {
        height: 80,
        backgroundColor: '#007efc',
        borderBottomColor: "#ccc",
        borderBottomWidth: 2,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        alignSelf: 'center',
        fontSize: 24,
      },
    }}>
      <BlogStack.Screen component={IndexScreen} name="Index" options={{ title: 'Moments' }}/>
      <BlogStack.Screen component={CreateScreen} name="Create" options={{ title: 'New moment' }} />
      <BlogStack.Screen component={ShowScreen} name="Show" options={{ title: 'Review moment' }} />
      <BlogStack.Screen component={EditScreen} name="Edit" options={{ title: 'Edit moment' }} />
    </BlogStack.Navigator>
  );
}

function MainNavComponent() {
  return (
    <MainNavTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Account')
            iconName = "account-cog";
          else
            iconName = "camera-burst"; 

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'darkblue',
        inactiveTintColor: 'gray',
      }}
    >
      <MainNavTab.Screen name="Blog" component={BlogStackComponent} />
      <MainNavTab.Screen name="Account" component={AccountScreen} />
    </MainNavTab.Navigator>
  );
}

function AuthStackComponent() {
  return (
    <AuthStack.Navigator mode="modal" initialRouteName="SignIn">
      <AuthStack.Screen component={SignInScreen} name="SignIn" options={{ headerShown: false }}/>
      <AuthStack.Screen component={SignUpScreen} name="SignUp" options={{ title: "Register Account" }} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  async function loadToken() {
    const token = await AsyncStorage.getItem("token");
    if (token)
      setSignedIn(true);

    setLoading(false);
  }

  useEffect(() => {
    loadToken();
  }, []);

  return loading ? (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
    ) : (
    <NavigationContainer>
      <MasterStack.Navigator mode="modal" headerMode="none" initialRouteName={signedIn ? "MainNav" : "AuthStack"}>
        <MasterStack.Screen component={MainNavComponent} name="MainNav"/>
        <MasterStack.Screen component={AuthStackComponent} name="AuthStack"/>
      </MasterStack.Navigator>
    </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
