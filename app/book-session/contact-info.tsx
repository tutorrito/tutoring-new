import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth'; // Assuming useAuth provides logged-in user's email and name

export default function ContactInfoScreen() {
  const params = useLocalSearchParams<{
    tutorName: string;
    tutorEmail: string;
    courseTitle: string;
    subjectName: string;
    date: string;
    time: string;
    price: string;
    courseId: string;
    tutorId: string;
    availabilitySlotId: string;
    subjectId: string; // Add subjectId
  }>();
  
  const { user, profile } = useAuth();

  const [studentName, setStudentName] = useState(profile?.full_name || '');
  const [studentEmail, setStudentEmail] = useState(user?.email || '');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentAddress, setStudentAddress] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  useEffect(() => {
    if (profile?.full_name) {
      setStudentName(profile.full_name);
    }
    if (user?.email) {
      setStudentEmail(user.email);
    }
  }, [user, profile]);

  const handleContinue = () => {
    if (!studentName.trim() || !studentEmail.trim() || !studentPhone.trim() || !studentAddress.trim()) {
      Alert.alert("Missing Information", "Please fill in all required contact details.");
      return;
    }
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(studentEmail)) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
        return;
    }

    router.push({
      pathname: '/book-session/confirm',
      params: {
        // Pass through all existing params from the previous screen ([id].tsx)
        tutorName: params.tutorName,
        tutorEmail: params.tutorEmail, // Ensure tutorEmail is explicitly passed
        courseTitle: params.courseTitle,
        date: params.date,
        time: params.time,
        price: params.price,
        courseId: params.courseId,
        tutorId: params.tutorId,
        availabilitySlotId: params.availabilitySlotId,
        subjectId: params.subjectId, // Pass subjectId
        
        // Add student details collected on this screen
        studentName,
        studentEmail,
        studentPhone,
        studentAddress,
        additionalNotes,
        
        // Map params for the confirm screen's expectations
        subject: params.subjectName, // Map subjectName to subject
        location: studentAddress,    // Map studentAddress to location
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Contact Information</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Please provide your details so the tutor can contact you
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              placeholderTextColor="#9CA3AF"
              value={studentName}
              onChangeText={setStudentName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Your email address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={studentEmail}
              onChangeText={setStudentEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Your phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={studentPhone}
              onChangeText={setStudentPhone}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Your address in Qatar"
              placeholderTextColor="#9CA3AF"
              value={studentAddress}
              onChangeText={setStudentAddress}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Additional Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any specific requirements or questions for the tutor"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
            />
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Tutor:</Text>
            <Text style={styles.summaryValue}>{params.tutorName}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Subject:</Text>
            <Text style={styles.summaryValue}>{params.subjectName}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={styles.summaryValue}>{params.date}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Time:</Text>
            <Text style={styles.summaryValue}>{params.time}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>1 hour</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Price:</Text>
            <Text style={[styles.summaryValue, styles.price]}>QAR {params.price}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue to Payment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    color: '#1F2937',
  },
  content: {
    padding: 24,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter_400Regular',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  summary: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#1F2937',
  },
  price: {
    color: '#059669',
    fontFamily: 'Inter_600SemiBold',
  },
  continueButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
