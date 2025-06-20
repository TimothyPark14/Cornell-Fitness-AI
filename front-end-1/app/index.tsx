import { Text, View } from "react-native";
import "../global.css";

export default function Index() {
  return (
    <View
      className="flex-1 items-center justify-center bg-cornell"
      style={{ padding: 20 }}
    >
      <Text className="text-white text-5xl text-center text-bold">Cornell Fitness AI</Text>
      <Text className="text-gray-400 text-xl text-center">Your personal gym planner</Text>
    </View>
  );
}
