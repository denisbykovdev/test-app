import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IProfile } from "../../types/IProfile";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    profile: null as Partial<IProfile> | null,
    loading: false,
    error: null as null | string,
  },
  reducers: {
    googleToken: (
      state,
      { payload }: PayloadAction<{ token: IProfile["token"] }>
    ) => {
      console.log(`auth/googleToken`, state)
      
      state.profile = {
        token: payload.token,
      };

      console.log(`auth/googleToken`, state)
    },
    googleProfile: (
      state,
      { payload }: PayloadAction<Omit<IProfile, "token">>
    ) => {
      state.profile = {
        ...state.profile,
        ...payload,
      };
    },
    googleLogout: (state) => {
      state.profile = null;
    },
  },
});
