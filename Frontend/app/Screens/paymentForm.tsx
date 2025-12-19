import { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Smartphone, AlertCircle, Loader2, CheckCircle } from 'lucide-react-native';
import ReceiptModal from './reciptModal';

interface Punishment {
  id: string;
  type: string;
  description: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
}

interface Student {
  name: string;
  studentId: string;
  department: string;
  batch: string;
}

interface PaymentFormProps {
  punishment: Punishment;
  student: Student;
  onPaymentSuccess: (punishmentId: string, mpesaCode: string) => void;
  onCancel: () => void;
}

const punishmentTypes = [
  'Lost Library Book',
  'Late Book Return',
  'Damaged Book',
  'Unreturned Book',
  'Photocopying Fine',
  'Library Card Replacement'
];

const PaymentForm = ({ punishment, student, onPaymentSuccess, onCancel }: PaymentFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedType, setSelectedType] = useState(punishment.type);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'processing' | 'confirm'>('form');
  const [mpesaCode, setMpesaCode] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);

  const handleSubmit = () => {
    setError('');

    // Validate Ethiopian phone number
    const phoneRegex = /^(07|\+2517)\d{8}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid M-Pesa phone number (e.g., 0712345678)');
      return;
    }

    // Simulate M-PESA payment processing
    setProcessing(true);
    setStep('processing');

    setTimeout(() => {
      const mockMpesaCode = `MP${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setMpesaCode(mockMpesaCode);
      setProcessing(false);
      setStep('confirm');
    }, 3000);
  };

  const handleConfirmPayment = () => {
    console.log('Continue button pressed - showing receipt');
    setShowReceipt(true);
  };

  const handleReceiptClose = () => {
    setShowReceipt(false);
    onPaymentSuccess(punishment.id, mpesaCode);
  };

  // Show receipt modal after payment confirmation - MUST BE FIRST
  if (showReceipt) {
    console.log('Showing receipt modal');
    return (
      <ReceiptModal
        student={student}
        punishment={punishment}
        mpesaCode={mpesaCode}
        paymentDate={new Date().toISOString()}
        onClose={handleReceiptClose}
      />
    );
  }

  if (step === 'processing') {
    return (
      <View className="bg-white rounded-lg shadow-md p-6">
        <View className="items-center py-8">
          <Loader2 size={48} color="#2563eb" className="animate-spin mb-4" />
          <Text className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</Text>
          <Text className="text-gray-600 text-center">Please check your phone for M-PESA prompt...</Text>
          <View className="mt-6 p-4 bg-blue-50 rounded-lg">
            <Text className="text-sm text-blue-800 text-center">
              Enter your M-PESA PIN on your phone to complete the payment
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (step === 'confirm') {
    return (
      <View className="bg-white rounded-lg shadow-md p-6">
        <View className="items-center py-8">
          <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
            <CheckCircle size={32} color="#16a34a" />
          </View>
          <Text className="text-lg font-semibold text-gray-900 mb-2">Payment Received!</Text>
          <Text className="text-gray-600 text-center mb-6">Your payment has been processed successfully</Text>
          
          <View className="bg-gray-50 rounded-lg p-4 mb-6">
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Transaction Code:</Text>
                <Text className="text-gray-900">{mpesaCode}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Amount:</Text>
                <Text className="text-gray-900">{punishment.amount} ETB</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Type:</Text>
                <Text className="text-gray-900">{selectedType}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleConfirmPayment}
            className="w-full bg-blue-600 py-2 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="bg-white m-4 p-4 rounded-lg shadow-md">
        <Text className="text-xl font-semibold text-gray-900 mb-6">Payment Form</Text>

        {/* Student Info Display */}
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Name:</Text>
            <Text className="text-gray-900">{student.name}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Student ID:</Text>
            <Text className="text-gray-900">{student.studentId}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Department:</Text>
            <Text className="text-gray-900">{student.department}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Batch:</Text>
            <Text className="text-gray-900">{student.batch}</Text>
          </View>
        </View>

        {/* Punishment Type Selection */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Punishment Type</Text>
          <TouchableOpacity className="w-full px-4 py-3 border border-gray-300 rounded-lg">
            <Text className="text-gray-900">{selectedType}</Text>
          </TouchableOpacity>
          <Text className="text-sm text-gray-600 mt-1">Tap to change punishment type</Text>
        </View>

        {/* Amount Display */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Amount</Text>
          <View className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg">
            <Text className="text-gray-900">{punishment.amount} ETB</Text>
          </View>
        </View>

        {/* Phone Number */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">M-PESA Phone Number</Text>
          <View className="relative">
            <Smartphone size={20} color="#9ca3af" className="absolute left-3 top-3" />
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="0712345678"
              keyboardType="phone-pad"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
            />
          </View>
          <Text className="text-sm text-gray-600 mt-1">
            Enter the phone number registered with M-PESA
          </Text>
        </View>

        {error && (
          <View className="p-3 bg-red-50 border border-red-200 rounded-lg flex-row items-start gap-2 mb-4">
            <AlertCircle size={20} color="#dc2626" />
            <Text className="text-red-800 text-sm flex-1">{error}</Text>
          </View>
        )}

        {/* Payment Info */}
        <View className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <Text className="text-sm text-blue-800">
            <Text className="font-semibold">Note:</Text> You will receive an M-PESA prompt on your phone. 
            Enter your PIN to complete the payment.
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
          >
            <Text className="text-gray-700 text-center font-semibold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={processing}
            className="flex-1 px-4 py-3 bg-blue-600 rounded-lg opacity-90"
          >
            <Text className="text-white text-center font-semibold">
              {processing ? 'Processing...' : 'Pay with M-PESA'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default PaymentForm;