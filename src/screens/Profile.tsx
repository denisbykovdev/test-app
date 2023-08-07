import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { ProfileNavProps } from "navigation/privateStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { authSlice } from "api/slices/auth";
import { IProfile } from "types/IProfile";

export default function Profile({ navigation, route }: ProfileNavProps) {
  const profileSelector = useTypedSelector((state) => state.auth.profile);

  const status = route.params;

  const dispatch = useTypedDispatch();

  console.log(`--- Profile/status:`, status);

  const googleLogout = async () => {
    await AuthSession.revokeAsync(
      {
        token: profileSelector?.token?.accessToken as string,
      },
      {
        revocationEndpoint: "https://oauth2.googleapis.com/revoke",
      }
    );

    await AsyncStorage.removeItem("google");

    dispatch(authSlice.actions.googleLogout());
  };

  const getGoogleUserData = async () => {
    const googleUserResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: {
          Authorization: `Bearer ${profileSelector?.token?.accessToken}`,
        },
      }
    );

    const jsonGoogleUserResponse = await googleUserResponse.json();

    dispatch(
      authSlice.actions.googleProfile({
        email: jsonGoogleUserResponse.email,
        family_name: jsonGoogleUserResponse.family_name,
        given_name: jsonGoogleUserResponse.given_name,
        id: jsonGoogleUserResponse.id,
        locale: jsonGoogleUserResponse.locale,
        name: jsonGoogleUserResponse.name,
        picture: jsonGoogleUserResponse.picture,
        verified_email: jsonGoogleUserResponse.verified_email,
      } satisfies Omit<IProfile, "token">)
    );
  };

  const showGoogleUserData = () => {
    if (profileSelector?.email) {
      return (
        <View style={styles.userInfo}>
          <Image
            source={{ uri: profileSelector?.picture }}
            style={styles.profilePic}
          />
          <Text>Full Name: {profileSelector?.name}</Text>
          <Text>Email: {profileSelector?.email}</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {showGoogleUserData()}
      <Text>Route Params Status: {route.params}</Text>
      <Button title="Google User Info" onPress={getGoogleUserData} />
      <Button title="Google Logout" onPress={googleLogout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: {
    width: 50,
    height: 50,
  },
  userInfo: {
    alignItems: "center",
    justifyContent: "center",
  },
});
