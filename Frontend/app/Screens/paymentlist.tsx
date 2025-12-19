import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { AlertCircle, CheckCircle, Calendar, FileText } from 'lucide-react-native'
import PaymentForm from './paymentForm';

interface Punishment {
  id: string;
  type: string;
  description: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
}

interface PaymentListProps {
  punishments: Punishment[];
  onPayClick: (punishment: Punishment) => void;
}

interface Student {
  name: string;
  studentId: string;
  department: string;
  batch: string;
}

const PaymentList = ({ punishments, onPayClick }: PaymentListProps) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPunishment, setSelectedPunishment] = useState<Punishment | null>(null);

  const pendingPunishments = punishments.filter(p => p.status === 'pending');
  const paidPunishments = punishments.filter(p => p.status === 'paid');

  const handlePayClick = (punishment: Punishment) => {
    setSelectedPunishment(punishment);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (punishmentId: string, mpesaCode: string) => {
    setShowPaymentForm(false);
    setSelectedPunishment(null);
    onPayClick({ ...punishments.find(p => p.id === punishmentId)!, status: 'paid' });
  };

  const handleCancelPayment = () => {
    setShowPaymentForm(false);
    setSelectedPunishment(null);
  };

  const sampleStudent: Student = {
    name: 'Nati Student',
    studentId: '693a67b03ed7',
    department: 'Software Eng.',
    batch: '2023'
  };

  if (showPaymentForm && selectedPunishment) {
    return (
      <PaymentForm
        punishment={selectedPunishment}
        student={sampleStudent}
        onPaymentSuccess={handlePaymentSuccess}
        onCancel={handleCancelPayment}
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="bg-white m-4 p-4 rounded-lg shadow-md">
        <Text className="text-xl  text-gray-500 mb-6 font-serif">Book Punishments</Text>

        {punishments.length === 0 && (
          <View className="items-center py-8">
            <CheckCircle size={48} color="#10b981" />
            <Text className="text-gray-600 mt-3">No punishments found</Text>
          </View>
        )}

        {pendingPunishments.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg text-gray-900 mb-3 font-serif">Pending </Text>
            {pendingPunishments.map((punishment) => (
              <View
                key={punishment.id}
                className="border border-red-200 bg-red-50 rounded-lg p-4 mb-3"
              >
                <View className="flex-row items-start mb-2">
                  <View className="flex-row items-start gap-2">
                    <AlertCircle size={20} color="#dc2626" />
                    <View className="flex-1">
                      <Text className="text-base font-serif text-gray-900">{punishment.type}</Text>
                      <Text className="text-sm text-gray-600 mt-1">{punishment.description}</Text>
                    </View>
                  </View>
                </View>
                <View className="flex-row items-center gap-2 text-sm text-gray-600 mb-3">
                  <Calendar size={16} color="#6b7280" />
                  <Text>{new Date(punishment.date).toLocaleDateString()}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-red-700 font-semibold">
                    Amount: {punishment.amount} ETB
                  </Text>
                  <TouchableOpacity
                    className="bg-blue-400 rounded-lg px-1 py-1"
                    onPress={() => handlePayClick(punishment)}
                  >
                    <Text className="text-white text-sm ">Pay Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {paidPunishments.length > 0 && (
          <View>
            <Text className="text-lg text-gray-900 mb-3">Payment History</Text>
            {paidPunishments.map((punishment) => (
              <View
                key={punishment.id}
                className="border border-green-200 bg-green-50 rounded-lg p-4 mb-3"
              >
                <View className="flex-row items-start gap-2 mb-2">
                  <CheckCircle size={20} color="#16a34a" />
                  <View className="flex-1">
                    <Text className="text-base font-serif text-gray-900">{punishment.type}</Text>
                    <Text className="text-sm text-gray-600 mt-1">{punishment.description}</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar size={16} color="#6b7280" />
                  <Text>{new Date(punishment.date).toLocaleDateString()}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-green-700 font-semibold">
                    Paid: {punishment.amount} ETB
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <FileText size={16} color="#16a34a" />
                    <Text className="text-sm text-green-600">Paid</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PaymentList;