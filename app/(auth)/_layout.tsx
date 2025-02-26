import {Image, View} from "react-native";
import React from "react";
import {Stack} from "expo-router";

export default function Layout() {
  return (
    <View className={"flex-1 dark:bg-neutral-900 bg-neutral-100"}>
        <Image source={require("@/assets/images/layered-waves-haikei.png")} className={"xs:h-8 sm:h-16 md:h-32 lg:h-40"} />
        <Image style={{aspectRatio: 4, resizeMode: "contain", height: "10%"}} source={require("@/assets/images/original-logo.png")} className={"mx-auto xs:mt-2 sm:mt-4 md:mt-6 lg:mt-8"}/>
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "simple_push"
            }}
        />
    </View>
  );
}