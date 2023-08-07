import { NavigationContainer } from "@react-navigation/native";
import { useTypedSelector } from "hooks/useTypedSelector";
import AuthStack from "./authStack";
import PrivateStack from "./privateStack";
import { Text } from "react-native";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

const config = {
  screens: {
    Auth: "",
    Profile: "Profile",
  },
};

const linking = {
  prefixes: ["http://localhost:8081", Linking.createURL("/")],
  config
};

export default function Router() {
  const profileSelector = useTypedSelector((state) => state.auth.profile);

  console.log(`--- router/profileSelector`, profileSelector);

  // const token = await AsyncStorage.getItem('google');
  
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      {profileSelector?.token === undefined ? <AuthStack /> : <PrivateStack />}
    </NavigationContainer>
  );
}
