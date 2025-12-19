import { Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import React from 'react';
import { X, Download, CheckCircle, Calendar, CreditCard, FileText } from 'lucide-react-native';

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

interface ReceiptModalProps {
  student: Student;
  punishment: Punishment;
  mpesaCode: string;
  paymentDate: string;
  onClose: () => void;
}

const ReceiptModal = ({ student, punishment, mpesaCode, paymentDate, onClose }: ReceiptModalProps) => {
  const handleDownloadPDF = () => {
    // Create a simple text receipt that can be copied and saved
    const receiptText = `
HRpayI Payment Receipt
Haramaya University
=====================

Transaction Details:
Transaction Code: ${mpesaCode}
Payment Date: ${new Date(paymentDate).toLocaleString()}
Status: PAID

Student Information:
Name: ${student.name}
Student ID: ${student.studentId}
Department: ${student.department}
Batch: ${student.batch}

Payment Information:
Punishment Type: ${punishment.type}
Description: ${punishment.description}
Amount Paid: ${punishment.amount} ETB

=====================
This is a computer-generated receipt and does not require a signature.
For inquiries, contact the Registrar Office at Haramaya University.
    `.trim();

    // Copy to clipboard for user to save
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(receiptText);
      alert('Receipt details copied to clipboard! You can paste and save this as a text file.');
    } else {
      alert('Receipt details ready. Please copy the text manually to save.');
    }
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-100">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 bg-white border-b border-gray-200">
          <Text className="text-xl font-semibold text-gray-900">Payment Receipt</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          <View className="p-6">
            {/* Success Icon */}
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                <CheckCircle size={32} color="#16a34a" />
              </View>
              <Text className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</Text>
              <Text className="text-gray-600 text-center">Your payment has been processed and recorded</Text>
            </View>

            {/* Transaction Info */}
            <View className="bg-gray-50 rounded-lg p-4 mb-6">
              <View className="flex-row items-center gap-2 mb-3">
                <FileText size={20} color="#6b7280" />
                <Text className="text-gray-900 font-semibold">Transaction Details</Text>
              </View>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Transaction Code:</Text>
                  <Text className="text-gray-900">{mpesaCode}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-600">Payment Date:</Text>
                  <View className="flex-row items-center gap-1">
                    <Calendar size={16} color="#6b7280" />
                    <Text className="text-gray-900">{new Date(paymentDate).toLocaleString()}</Text>
                  </View>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Status:</Text>
                  <Text className="text-green-600 font-semibold">PAID</Text>
                </View>
              </View>
            </View>

            {/* Student Info */}
            <View className="bg-gray-50 rounded-lg p-4 mb-6">
              <View className="flex-row items-center gap-2 mb-3">
                <CreditCard size={20} color="#6b7280" />
                <Text className="text-gray-900 font-semibold">Student Information</Text>
              </View>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Name:</Text>
                  <Text className="text-gray-900">{student.name}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Student ID:</Text>
                  <Text className="text-gray-900">{student.studentId}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Department:</Text>
                  <Text className="text-gray-900">{student.department}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Batch:</Text>
                  <Text className="text-gray-900">{student.batch}</Text>
                </View>
              </View>
            </View>

            {/* Payment Details */}
            <View className="bg-gray-50 rounded-lg p-4 mb-6">
              <Text className="text-gray-900 font-semibold mb-3">Payment Information</Text>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Punishment Type:</Text>
                  <Text className="text-gray-900">{punishment.type}</Text>
                </View>
                <View>
                  <Text className="text-gray-600 mb-1">Description:</Text>
                  <Text className="text-gray-900 text-sm">{punishment.description}</Text>
                </View>
                <View className="flex-row justify-between pt-2 border-t border-gray-200">
                  <Text className="text-gray-900 font-semibold">Amount Paid:</Text>
                  <Text className="text-green-600 font-semibold">{punishment.amount} ETB</Text>
                </View>
              </View>
            </View>

            {/* Footer Note */}
            <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <Text className="text-sm text-blue-800">
                This receipt has been generated for your records. Please save this receipt 
                for future reference. For any inquiries, contact the Registrar Office.
              </Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleDownloadPDF}
                className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 bg-blue-600 rounded-lg"
              >
                <Download size={20} color="white" />
                <Text className="text-white font-semibold">Download PDF Receipt</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
              >
                <Text className="text-gray-700 font-semibold text-center">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ReceiptModal;