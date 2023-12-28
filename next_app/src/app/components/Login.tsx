"use client";

import React from "react";
import { StytchLogin } from "@stytch/nextjs";
import {
  Callbacks,
  Products,
  StytchEvent,
  StytchEventType,
} from "@stytch/vanilla-js";
import { API_BASE_URL } from "./config";

/*
 * Login configures and renders the StytchLogin component which is a prebuilt UI component for auth powered by Stytch
 *
 * This component accepts style, config, and callbacks props. To learn more about possible options review the documentation at
 * https://stytch.com/docs/sdks/javascript-sdk#ui-configs
 */

interface LoginProps {
  onLoginSuccess?: () => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const loginCallback: Callbacks = {
    onEvent(event: StytchEvent) {
      const eventType = event.type;
      if (
        eventType === StytchEventType.OTPsLoginOrCreateEvent ||
        eventType === StytchEventType.PasswordAuthenticate
      ) {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    },
  };
  const styles = {
    buttons: {
      primary: {
        backgroundColor: "#19303D",
        borderColor: "#19303D",
        borderRadius: "4px",
        textColor: "#FFFFFF",
      },
    },
  };

  const config = {
    products: [Products.otp, Products.passwords],
    otpOptions: {
      methods: ["sms"],
      expirationMinutes: 5,
    },
    sessionOptions: {
      sessionDurationMinutes: 60,
    },
    passwordOptions: {
      loginRedirectURL: API_BASE_URL + "/authenticate",
      resetPasswordRedirectURL: API_BASE_URL + "/authenticate",
    },
  } as Parameters<typeof StytchLogin>[0]["config"];

  return (
    <StytchLogin config={config} styles={styles} callbacks={loginCallback} />
  );
};

export default Login;
