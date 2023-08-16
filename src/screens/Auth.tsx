import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Platform,
  // Easing,
  SafeAreaView,
  // Animated,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { FC, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import { authSlice } from "api/slices/auth";
import { IProfile } from "types/IProfile";
import * as WebBrowser from "expo-web-browser";
import { Link, useLinkTo } from "@react-navigation/native";
import { AuthNavProps } from "navigation/authStack";
import { useTypedSelector } from "hooks/useTypedSelector";
import { useTypedDispatch } from "hooks/useTypedDispatch";

WebBrowser.maybeCompleteAuthSession();

const useProxy = true;

const redirectUri = AuthSession.makeRedirectUri({
  //@ts-ignore
  useProxy,
});

export default function Auth({ navigation }: AuthNavProps) {
  // const [googleUser, setGoogleUser] = useState<Omit<IProfile, "token">>();
  // const [googleToken, setGoogleToken] = useState<AuthSession.TokenResponse>();
  const [requireRefreshGoogle, setRequireRefreshGoogle] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "781116592781-57gs0ijbe4tkq4mp2s42j3d1rv04j0bm.apps.googleusercontent.com",
    iosClientId:
      "781116592781-a97stifrhfaudi31b373fi75q7qcj3ap.apps.googleusercontent.com",
    webClientId:
      "781116592781-1qodr40mq0d5ns544f5bf6inj920k7m7.apps.googleusercontent.com",
    redirectUri,
  });

  const profileSelector = useTypedSelector((state) => state.auth.profile);

  const dispatch = useTypedDispatch();

  const getClientId = () => {
    if (Platform.OS === "ios") {
      return "781116592781-57gs0ijbe4tkq4mp2s42j3d1rv04j0bm.apps.googleusercontent.com";
    } else if (Platform.OS === "android") {
      return "781116592781-a97stifrhfaudi31b373fi75q7qcj3ap.apps.googleusercontent.com";
    } else {
      //web key
      return "781116592781-1qodr40mq0d5ns544f5bf6inj920k7m7.apps.googleusercontent.com";
    }
  };

  // const refreshToken = async () => {
  //   const clientId = getClientId();

  //   console.log(`--- refreshToken/clientId:`, clientId);
  //   console.log(
  //     `--- refreshToken/googleToken?.refreshToken:`,
  //     googleToken?.refreshToken
  //   );

  //   const tokenResult = await AuthSession.refreshAsync(
  //     {
  //       clientId: clientId,
  //       refreshToken: googleToken?.refreshToken,
  //     },
  //     {
  //       tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
  //     }
  //   );

  //   tokenResult.refreshToken = googleToken?.refreshToken;

  //   console.log(`--- refreshToken/tokenResult:`, tokenResult);

  //   setGoogleToken(tokenResult);

  //   authSlice.actions.googleToken({ token: tokenResult });

  //   await AsyncStorage.setItem("google", JSON.stringify(tokenResult));

  //   setRequireRefreshGoogle(false);
  // };

  useEffect(() => {
    console.log(`--- googleAuth/response:`, response);

    if (response !== null && response.type === "success") {
      // setGoogleToken(response.authentication as AuthSession.TokenResponse);

      dispatch(
        authSlice.actions.googleToken({
          token: response.authentication as AuthSession.TokenResponse,
        })
      );

      const persistAuth = async () => {
        await AsyncStorage.setItem(
          "google",
          JSON.stringify(response.authentication)
        );
      };

      persistAuth();
    }
  }, [response]);

  useEffect(() => {
    const getPersistedAuth = async () => {
      const jsonValue = await AsyncStorage.getItem("google");
      if (jsonValue != null) {
        const authFromJson = JSON.parse(jsonValue);

        // setGoogleToken(authFromJson);

        console.log(`--- getPersistedAuth/authFromJson`, authFromJson);

        setRequireRefreshGoogle(
          !AuthSession.TokenResponse.isTokenFresh({
            expiresIn: authFromJson.expiresIn,
            issuedAt: authFromJson.issuedAt,
          })
        );
      }
    };
    getPersistedAuth();
  }, []);

  // if (requireRefreshGoogle) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Token requires refresh...</Text>
  //       <Button title="Refresh Token" onPress={refreshToken} />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <Button
        title="Login Google"
        onPress={() =>
          promptAsync({
            //@ts-ignore
            useProxy: false,
            showInRecents: true,
          })
        }
      />
      {profileSelector?.token && (
        <Link to={{ screen: "Profile", params: { status: "logged-in" } }}>
          <Button title="Profile" />
        </Link>
      )}
      <StatusBar style="auto" />
    </View>
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
