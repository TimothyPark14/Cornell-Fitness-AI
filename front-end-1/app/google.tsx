import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";
import React, { useState } from "react";
import "../global.css";

export default function Google() {
  const { setUser } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const handleGoogleSignIn = () => {
    setUser({email} as any);
    console.log("User set in context:", {email});
    router.push("/register-info");
  }

  return (
    <View
      className="flex-1 items-center justify-center bg-cornell"
      style={{ padding: 20 }}
    >
      <Text className="text-white text-xl text-center">Assuming that the Google authentication worked</Text>
      <TextInput
        placeholder="email address"
        className="bg-white/10 rounded-lg px-4 py-3 mt-4 text-white text-lg"
        onChangeText={setEmail}
        value={email}
        placeholderTextColor="white" // <-- add this
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        className="bg-white px-6 py-3 rounded mt-10"
        onPress={handleGoogleSignIn}>
      
        <Text className="text-cornell text-lg font-bold">Register Information</Text>
      </TouchableOpacity>
    </View>
  );
}