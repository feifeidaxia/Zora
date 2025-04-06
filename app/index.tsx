import React from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [isOnboarding, setIsOnboarding] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const checkOnboarding = async () => {
      const onboarding = await AsyncStorage.getItem("onboarding");
      if (onboarding) {
        setIsOnboarding(false);
      }
      setLoading(false);
    };
    checkOnboarding();
  }, []);

  if (loading) {
    return null;
  }
  return <Redirect href={isOnboarding ? "/onboarding" : "/home"} />;
}
