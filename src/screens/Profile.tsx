import { SafeAreaView } from "react-native-safe-area-context";
import React, { FC, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { ProfileNavProps } from "navigation/privateStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import { useTypedDispatch } from "hooks/useTypedDispatch";
import { authSlice } from "api/slices/auth";
import { IProfile } from "types/IProfile";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

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

  const rotation = useSharedValue(0);
  
  const [currentAngle, setCurrentAngle] = useState(rotation.value);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  const handleAngle = (value: number) => {
    setCurrentAngle(parseInt(value.toFixed(), 10));
  };

  const easing = Easing.bezier(0.23, 1, 0.32, 1);

  const gesture = Gesture.Pan().onUpdate((e) => {
    rotation.value = withTiming(
      Math.abs(e.velocityY) / 7 + rotation.value,
      {
        duration: 1000,
        easing: easing,
      },
      () => runOnJS(handleAngle)(rotation.value % 360)
    );
  });

  const getCurrentColor = () => {
    if (currentAngle < 91) return "Red";
    if (currentAngle < 181) return "Green";
    if (currentAngle < 271) return "Yellow";
    return "Blue";
  };

  return (
    <SafeAreaView style={styles.container}>
      {showGoogleUserData()}
      <Button title="Google User Info" onPress={getGoogleUserData} />
      {profileSelector?.token && (
        <SafeAreaView style={styles.container}>
          <GestureHandlerRootView>
          <GestureDetector gesture={gesture}>
            <View style={styles.circleContainer}>
              <View style={styles.pointer} />
              <Animated.View style={[styles.circle, animatedStyles]}>
                <Wheel />
              </Animated.View>
            </View>
          </GestureDetector>
          </GestureHandlerRootView>
          <Info currentAngle={currentAngle} currentColor={getCurrentColor()} />
        </SafeAreaView>
      )}
      <Button title="Google Logout" onPress={googleLogout} />
    </SafeAreaView>
  );
}

const Wheel = () => {
  return (
    <>
      <View style={styles.circleRow}>
        <View style={[styles.pizza, styles.pizzaRed]} />
        <View style={[styles.pizza, styles.pizzaBlue]} />
      </View>
      <View style={styles.circleRow}>
        <View style={[styles.pizza, styles.pizzaGreen]} />
        <View style={[styles.pizza, styles.pizzaYellow]} />
      </View>
    </>
  );
};

const Info: FC<{ currentColor: string; currentAngle: number }> = ({
  currentAngle,
  currentColor,
}) => {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.text}>Current Color: {currentColor}</Text>
      <Text style={styles.text}>Current Angle: {currentAngle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    width: 50,
    height: 50,
  },
  userInfo: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleRow: { width: "100%", height: "50%", flexDirection: "row" },
  pizza: { width: "50%", height: "100%" },
  pizzaRed: { backgroundColor: "#ce4257" },
  pizzaBlue: { backgroundColor: "#4361ee" },
  pizzaYellow: { backgroundColor: "#fee440" },
  pizzaGreen: { backgroundColor: "#06d6a0" },
  text: {
    color: "white",
    fontSize: 16,
  },
  infoBox: {
    marginTop: 15,
    height: 40,
    justifyContent: "space-between",
  },
  circle: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 150,
    borderWidth: 2,
    overflow: "hidden",
    borderColor: "#ced4da",
  },
  ball: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: "blue",
    alignSelf: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#343a40",
  },
  circleContainer: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  pointer: {
    width: 10,
    height: 30,
    backgroundColor: "black",
    position: "absolute",
    top: -15,
    borderWidth: 2,
    borderColor: "white",
    zIndex: 6000,
  },
});
