import * as AuthSession from "expo-auth-session";

export interface IProfile {
  token: AuthSession.TokenResponse;
  email: string;
  family_name: string; //second name
  given_name: string; //first name
  id: string;
  locale: string;
  name: string; //full name
  picture: string;
  verified_email: boolean;
}
