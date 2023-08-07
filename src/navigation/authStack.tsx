import React from "react";
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import Auth from "screens/Auth";

type AuthScreensType = {
  Auth: undefined;
  Profile: undefined;
};

export type AuthNavProps = NativeStackScreenProps<AuthScreensType, "Auth" | "Profile">;

const AuthStackNavigator = createNativeStackNavigator<AuthScreensType>();

export default function AuthStack() {
  return (
    <AuthStackNavigator.Navigator>
      <AuthStackNavigator.Screen
        name="Auth"
        component={Auth}
        options={{ title: "Auth" }}
      />
    </AuthStackNavigator.Navigator>
  );
}
