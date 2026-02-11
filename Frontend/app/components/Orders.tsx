import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useState } from "react";

const size = {
  width: 35,
  height: 35,
};

const items = [
  {
    title: "bottle",
    Discrption: "order Now",
    image: (
      <Image
        source={require("../../assets/images/bottle.jpeg")}
        style={{
          width: 100,
          height: 120,
          borderRadius: 10,
        }}
      />
    ),
  },
];

function Paymentlist() {
  const [Ordering, SetOrdering] = useState(false);
  const [payment, SetPayment] = useState(false);
  return (
    <View>
      <Modal visible={Ordering} transparent={true} animationType="fade">
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center w-full h-[100vh]">
          <View className=" bg-white w-5/6 h-2/3 rounded-lg items-center flex-col">
            <View className=" mb-8 w-full h-12 flex-row justify-center items-center my-[2px] rounded-lg ">
              <Text className="text-xl font-bold">ordering</Text>
            </View>
            <View className="w-full h-full items-center justify-center relative bottom-28">
              <Text>{items[0].image}</Text>
              <View className="bg-green-700 w-44 h-12 rounded-xl items-center justify-center relative top-4">
                <TouchableOpacity onPress={() => SetPayment(true)}>
                  <Text className="text-white text-center text-[14px]">
                    Pay With M-PESA
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity
            className="relative top-2 right-2 bg-red-500 p-2 rounded-full"
            onPress={() => SetOrdering(false)}
          >
            <Text className="text-white">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={payment} transparent={true} animationType="fade">
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center w-full h-[100vh]">
          <View className=" bg-white w-5/6 h-1/4 rounded-lg items-center flex-col">
            <View className=" mb-4 w-full h-12 flex-row justify-center items-center my-[1px] rounded-lg ">
              <Text className="text-xl font-bold">Payment</Text>
              <TouchableOpacity onPress={() => SetPayment(false)}>
                <Image
                  source={require("../../assets/images/close.png")}
                  style={{ width: 22, height: 24, tintColor: "red" ,backgroundColor:"white" }}
                  className="relative left-28 cursor-pointer"
                />
              </TouchableOpacity>
            </View>
            <Text className="text-xl">Enter your M-pesa Number</Text>
            <View className="bg-gray-100 w-5/6 h-12 rounded-xl items-center justify-start relative top-2 border border-gray-400 flex-row">
              <Text className="text-xl relative left-6 bottom-0.5">+257</Text>
              <TextInput className="w-[60%] rounded-xl relative left-6 text-xl" />
            </View>
            <TouchableOpacity className="bg-green-700 w-28 h-10 rounded-xl items-center justify-center relative top-10">
              <Text className="text-white text-[16px]"> Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View className="w-full h-72 bg-white p-2 rounded-xl items-center justify-center bg-gray-200 bg-[url('/assets/images/bottle.jpeg')]">
        <View className="grid grid-cols-1 gap-4">
          {items.map((item, index) => (
            <View key={index}>
              {item.image}
              <TouchableOpacity
                onPress={() => SetOrdering(true)}
                className="flex-col items-center justify-center relative top-5 bg-green-700 w-28 h-10 rounded-xl"
              >
                <Text className="text-white">{item.Discrption}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default Paymentlist;
