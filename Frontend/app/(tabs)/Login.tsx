import { Text, View, Button, StyleSheet } from 'react-native'
import Animated, {useSharedValue, withTiming, useAnimatedStyle,Easing} from 'react-native-reanimated'
import React from 'react'
import "../global.css"
import { SafeAreaView } from 'react-native-safe-area-context'
const Login = () => {
  const randomWidth = useSharedValue(100);

  const config = {
    duration: 500,
    easing: Easing.bounce,
  };
  
 const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config)
    };
  });
  return (
    <SafeAreaView>
      <View className='flex-1 items-center justify-center'>
        <Text className='text-2xl font-bold'>Welcome To Login Page</Text>
        <Animated.View style={[styles.box, style]}>
          <Button title="Login" onPress={() => {randomWidth.value = Math.random() * 10}}  /> 
        </Animated.View>

      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ 
  box:{
    width:100,
    height:200,
    backgroundColor: 'red',
    margin: 20,
    borderRadius: 20,
  }
});
export default Login;

