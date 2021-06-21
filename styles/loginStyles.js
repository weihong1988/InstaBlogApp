import React from "react";
import { StyleSheet } from "react-native";

export const loginStyles = {
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 24,
  },
  fieldTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    borderColor: "#999",
    borderWidth: 1,
    marginBottom: 24,
    padding: 4,
    height: 36,
    fontSize: 18,
    backgroundColor: "white",
  },
  loginButton: {
    backgroundColor: "blue",
    borderRadius: 20,
    width: 120,
    alignItems: "center",
    padding: 18,
    marginTop: 12,
    marginBottom: 24,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  SignUpButton: {
    marginTop: 8,
    marginBottom: 18,
  },
  SignUpText: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    height: 30,
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 24,
  },
};