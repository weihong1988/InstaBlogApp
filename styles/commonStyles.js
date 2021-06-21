import React from "react";
import { StyleSheet } from "react-native";

export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  BlogContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderColor: "#999",
    borderWidth: 1,
    marginBottom: 10,
    padding: 4,
    height: 36,
    fontSize: 18,
    backgroundColor: "white",
  },
  subDesc: {
    fontSize: 18,
    marginBottom: 12,
    fontStyle: "italic"
  },
  actionButton: {
    backgroundColor: "blue",
    borderRadius: 20,
    width: 120,
    alignItems: "center",
    padding: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 20,
    width: 120,
    alignItems: "center",
    padding: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  deleteButtonText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
  imageContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 180,
    height: 180,
    borderWidth: 1,
  },
  image: {
    width: 180,
    height: 180,
    borderWidth: 1,
    padding: 1,
  },
  iconButton: {
    alignSelf: 'center',
    marginLeft: '10%',
    borderRadius: 10,
    marginRight: 50
  },
  errorText: {
    color: "red",
    height: 24,
    fontWeight: "bold",
    fontSize: 18,
  },
  descriptionText: {
    marginTop: 20,
    fontSize: 18,
    fontStyle: "italic",
  }
};
