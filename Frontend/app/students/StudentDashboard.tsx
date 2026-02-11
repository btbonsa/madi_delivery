import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";
import { useState } from "react";
import React from "react";
import { MenuIcon, LogOutIcon, UserIcon, SettingsIcon } from "lucide-react-native";
import { router } from "expo-router";
import PaymentList from "../components/Orders";

const StudentDashboard = () => {
  const handlePayClick = (punishment: any) => {
    console.log("Pay clicked for:", punishment);
    // Add payment logic here
  };

  const samplePunishments = [
    {
      id: "1",
      type: "Late Book Return",
      description: "Return book 3 days late",
      date: "2024-12-15",
      amount: 50,
      status: "pending" as const,
    },
    {
      id: "2",
      type: "Book Damage",
      description: "Damaged book cover",
      date: "2024-12-10",
      amount: 25,
      status: "paid" as const,
    },
  ];

  const MenuItems = [
    { label: "Settings", icon: <SettingsIcon /> },
    {
      label: "Logout",
      onPress: () => router.push("/Login"),
      icon: <LogOutIcon />,
    },
    {
      label: "Profile",
  
      icon: <UserIcon />,
    },
  ];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  

  return (
    <View className="flex bg-gray-100 w-full h-full max-h-200">
      {/* 1. Header Section */}
      <View className="flex-row h-35 bg-green-600 items-center justify-between px-4 pt-8 shadow-md">
      

        <View className="relative">
          <TouchableOpacity
            className="p-2"
            onPress={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MenuIcon size={24} color="white" />
          </TouchableOpacity>
        </View>
          <View
          className="w-12 h-12 rounded-3xl bg-white/20 items-center justify-center border-2 mb-2"
          style={{ zIndex: 1000, elevation: 10 }}
        >
          <TouchableOpacity onPress={() => router.push("/students/profile")}>
            <View className="w-12 h-12 rounded-full bg-red-200 items-center justify-center">
              <Image
                source={require("../../assets/images/photo.jpg")}
                style={{ width: 40, height: 40, borderRadius: 50 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {isMenuOpen && (
        <View
          className="absolute top-20 w-48 h-full bg-white py-2 shadow-xl border border-gray-100"
          style={{ zIndex: 99999, elevation: 30, position: "absolute" }}
        >
          {MenuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              className="p-3 rounded-xl flex-row items-center active:bg-gray-100 mx-2 my-1"
              onPress={item.onPress}
            >
              {item.icon && <View className="mr-3">{item.icon}</View>}
              <Text className="text-gray-800 font-medium">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView
        className="flex-1 p-4 w-full h-full"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full h-110 ">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row mb-6 p-1"
          >
            <View className="bg-white w-40 h-28 rounded-xl p-4 mr-4 transition duration-100 hover:translate-y-1 border border-gray-100 justify-between">
              <Text className="text-gray-500 font-medium text-sm">
                Total Punishments
              </Text>
              <Text className="text-black text-2xl font-bold">0</Text>
            </View>

            <View className="bg-white w-40 h-28 rounded-xl p-4 mr-4 trans ition duration-100 hover:translate-y-1 justify-between">
              <Text className="text-gray-500 font-medium text-sm">
                Pending Amount
              </Text>
              <Text className="text-red-500 text-xl font-bold">0 ETB</Text>
            </View>

            <View className="bg-white w-40 h-28 rounded-xl p-4 mr-4 justify-between transition duration-100 hover:translate-y-1">
              <Text className="text-gray-500 font-medium text-sm">
                Paid Amount
              </Text>
              <Text className="text-green-600 text-xl font-bold">0 ETB</Text>
            </View>
          </ScrollView>
        </View>
        <View className="mb-6">
          <PaymentList
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default StudentDashboard;

