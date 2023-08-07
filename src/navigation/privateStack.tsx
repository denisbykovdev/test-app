import React from "react";
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import Profile from "screens/Profile";

type PrivateScreensType = {
  Auth: undefined;
  Profile: undefined;
  // {
  //   status: 'logged in' | 'logged out';
  // };
};

export type ProfileNavProps = NativeStackScreenProps<
  PrivateScreensType,
  "Profile"
>;

const PrivateStackNavigator = createNativeStackNavigator<PrivateScreensType>();

export default function PrivateStack() {
  return (
    <PrivateStackNavigator.Navigator>
      <PrivateStackNavigator.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Profile" }}
        // initialParams={{
        //     status: 'logged out'
        // }}
      />
    </PrivateStackNavigator.Navigator>
  );
}
