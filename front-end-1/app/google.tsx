import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import "../global.css";

export default function Google() {
  const router = useRouter();
  return (
    <View
      className="flex-1 items-center justify-center bg-cornell"
      style={{ padding: 20 }}
    >
      <Text className="text-white text-xl text-center">Assuming that the Google authentication worked</Text>
      <TouchableOpacity
        className="bg-white px-6 py-3 rounded mt-10"
        onPress={() => router.push("/register-info")}>
      
        <Text className="text-cornell text-lg font-bold">Register Information</Text>
      </TouchableOpacity>
    </View>
  );
}