import createSagaMiddleware from "redux-saga";
import { configureStore, MiddlewareArray } from "@reduxjs/toolkit";
import createDebugger from "redux-flipper";
import { authSlice } from "./api/slices/auth";
import rootSaga from "./api/rootSaga";

const sagaMiddleware = createSagaMiddleware();

// const reduxDebugger = createDebugger();

const rootReducer = {
  auth: authSlice.reducer,
};

export const store = configureStore({
  reducer: rootReducer,
  // middleware: new MiddlewareArray().concat(sagaMiddleware, reduxDebugger),
  middleware: new MiddlewareArray().concat(sagaMiddleware),
  devTools: true,
  
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
