import { Text, TouchableOpacity, View , ScrollView} from "react-native";
import React from "react";
import { TextInput } from "react-native";
import { useState } from "react";
import {router} from "expo-router";
const SignUpScreen = () => {
  const department = [
    "computer science",
    "engereening",
    "Accounting",
    "Business",
    "Marketing",
    "Law",
    "Medicine",
    "Pharmacy",
    "Psychology",
    "Statistics",
    "Theology",
    "Other",
  ];

  const batch = [
    "2018",
    "2017",
    "2016",
    "2015",
    "2014",
    "2013",
    "2012",
    "2011",
    "2010",
  ];

  const [selected, setSelected] = useState("");
  const [option, setOption] = useState(false);
  const [batchOption, setBatchOption] = useState(false);
  const [batchSelected, setBatchSelected] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
const handleSignUp = () => {
  setErrorMessage("")
if(!fullName || !email || !password || !confirmPassword){
    setErrorMessage("Please fill all fields")
    return
}
if(password !== confirmPassword){
    setErrorMessage("Password do not match")
    return
}
router.push("/Login")
}


  return (
    <ScrollView className="bg-white w-full h-screen">
      <View className="flex-1 mx-4 justify-center my-20">
        <View className="flex justify-center items-center">
          <View className="w-16 h-16 bg-green-600 rounded-full justify-center items-center p-2 shadow-lg">
            <Text className="text-white text-[13px]">HRPay</Text>
          </View>
          <View className="mb-5">
            <Text className="text-center text-xl font-semibold mt-2">
              Register!
            </Text>
          </View>
        </View>
        <View className="flex mx-4 items-center gap-3">
          <View className="border border-black/5 rounded-2xl w-full h-16 ">
            <TextInput
              placeholder="Full Name"
              className="flex-1 p-4 w-full bg-black/5"
              selectTextOnFocus
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          <View className="border border-black/5 rounded-2xl w-full h-16">
            <TextInput
              placeholder="Email"
              className="flex-1 p-4 w-full bg-black/5"
              selectTextOnFocus
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View className="border border-black/5 rounded-2xl w-full h-16">
            <TextInput
              placeholder="password"
              className="flex-1 p-4 w-full bg-black/5"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View className="border border-black/5 rounded-2xl w-full h-16">
            <TextInput
              placeholder="confirm Password"
              className="flex-1 p-4 w-full bg-black/5"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          <View className="border border-black/5 rounded-2xl w-full h-16">
            <TextInput
              placeholder="select"
              className="flex-1 p-4 w-full bg-black/5"
              selectTextOnFocus
              value={selected}
              onFocus={() => setOption(true)}
            />
          </View>
              <View className="border border-black/5 rounded-2xl w-full h-16">
            <TextInput
              placeholder="select"
              className="flex-1 p-4 w-full bg-black/5"
              selectTextOnFocus
              value={batchSelected}
              onFocus={() => setBatchOption(true)}
            />
          </View>
          <View className="border border-black/5 rounded-2xl">
            {option &&
              department.map((item) => (
                <TouchableOpacity
                  key={item}
                  className="p-4 w-80 bg-black/5"
                  onPress={() => {
                    setSelected(item);
                    setOption(!option);
                  }}
                >
                  <Text className="text-center">{item}</Text>
                </TouchableOpacity>
              ))}
          </View>
      
          <View className="border border-black/5 rounded-2xl ">
            {batchOption &&
              batch.map((item) => (
                <TouchableOpacity
                  key={item}
                  className="p-4 w-80 bg-black/5"
                  onPress={() => {
                    setBatchSelected(item);
                    setBatchOption(!batchOption);
                  }}
                >
                  <Text className="text-center">{item}</Text>
                </TouchableOpacity>
              ))}
          </View>
          <View className="flex flex-row justify-center items-center bg">
            <Text className="text-red-600">{errorMessage}</Text>
          </View>
             <View className="border border-black/5 rounded-2xl w-full h-16">
             <TouchableOpacity className="flex-1 p-4 w-full bg-green-600 rounded-2xl">
              <Text className="text-center text-white font-semibold" onPress={handleSignUp}>Sign Up</Text>
             </TouchableOpacity>
          </View>
          <View className="flex flex-row justify-center items-center">
            <Text>Already have an account?</Text>
            <TouchableOpacity className="">
              <Text className="text-blue-600" onPress={() => router.push("/Login")}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;

