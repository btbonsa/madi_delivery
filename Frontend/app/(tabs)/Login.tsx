import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Text,
} from "react-native";

import { router } from "expo-router";
import { GraduationCap } from "lucide-react-native";
import { useState } from "react";
import axios from "axios";

const LoginScreen = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = async () => {
    try {
      const response = await axios.post("http://localhost:7000/api/auth/login", {
        Email: email,
        Password: password,
      });
      setErrorMessage(response.data.msg);
      router.push("/students");
    } catch (error: any) {
      if (error.response) {
        setErrorMessage(error.response.data.msg);
      }
    }
  };
  return (
    <View className="bg-white w-full h-full">
      <View className="flex-1 mx-4 justify-center">
        <View className="flex justify-center items-center">
          <View className="w-16 h-16 bg-white rounded-full justify-center items-center border border-gray-200 rounded-full shadow-lg">
            <GraduationCap className="w-10 h-10 text-black " />
          </View>
        </View>
        <View className="flex mx-4 space-y-1 gap-3">
          <Text className="text-2xl font-semibold text-center mb-5">Login</Text>
          <View className="bg-black/5 rounded-2xl w-full ">
            <TextInput
              placeholder="Email"
              className="p-4 rounded-xl"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View className="bg-black/5 rounded-2xl w-full">
            <TextInput
              placeholder="Password"
              className="p-4 rounded-xl"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View className="flex items-center justify-center my-2">
            <Text className="text-red-600">{errorMessage}</Text>
          </View>
          <View className="w-full">
            <TouchableOpacity
              className="bg-green-600 rounded-2xl w-full p-4 items-center mt-6"
              onPress={onFinish}
            >
              <Text className="text-white">Login</Text>
            </TouchableOpacity>
          </View>

          <View className="flex flex-row justify-center items-center">
            <Text>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/signUp")}>
              <Text className="text-blue-600">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
