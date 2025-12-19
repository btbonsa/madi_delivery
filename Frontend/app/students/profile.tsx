import { StyleSheet, Text, View, Image, TouchableOpacity , Alert} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
const Profile = () => {
    const [ProfilePhoto , setProfilePhoto] = useState<string | null>(null);
  const pickImage = async () => {

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };



  return (
    <View className="flex-1 items-center justify-center">
      <View>
        <View className="w-28 h-28 rounded-full bg-green-200 items-center justify-center border border-gray-100">
       
          {
            ProfilePhoto ? (
                <Image source={{uri: ProfilePhoto}} 
                style={{ width: 100, height: 100, borderRadius: 50 }}
                />
            ) : (
                <Image
            source={require("../../assets/images/photo.jpg")}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
            )
          }
        </View>
      </View>
      <View className="flex-row gap-4 items-center justify-center mt-4">
        <TouchableOpacity onPress = {pickImage}>
            
        <View className="w-28 h-10 items-center justify-center border border-green-300 rounded-xl">
          <Text>Take Photo</Text>
        </View>
        </TouchableOpacity>
        <View className="w-28 h-10 items-center justify-center bg-orange-500 border border-orange-500 rounded-xl">
            <TouchableOpacity onPress = {pickImage}>
          <Text>Set Photo</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
