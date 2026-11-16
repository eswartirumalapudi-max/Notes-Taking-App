
import { router } from 'expo-router';
import {
  Box,
  Button,
  Heading,
  Input,
  Pressable,
  Text,
  VStack,
} from 'native-base';
import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const [signup, setSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password.trim()) {
      Alert.alert('Missing details', 'Enter your email and password.');
      return;
    }

    if (signup && !name.trim()) {
      Alert.alert('Missing name', 'Enter your name.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (signup) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          Alert.alert('Success', 'Your account has been created.');
          router.replace('/');
        } else {
          Alert.alert(
            'Account created',
            'Please check your email and confirm your account, then log in.'
          );
          setSignup(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) throw error;

        router.replace('/');
      }
    } catch (error: any) {
      Alert.alert('Authentication failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} bg="coolGray.100" justifyContent="center" px={6}>
      <Box bg="white" p={6} rounded="2xl" shadow={3}>
        <VStack space={4}>
          <Heading textAlign="center" color="blue.700" size="2xl">
            My Notes
          </Heading>

          <Text textAlign="center" color="coolGray.500">
            {signup ? 'Create your account' : 'Welcome back! Log in to continue.'}
          </Text>

          {signup && (
            <Input
              placeholder="Full name"
              value={name}
              onChangeText={setName}
              size="lg"
              autoCapitalize="words"
            />
          )}

          <Input
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            size="lg"
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            type="password"
            size="lg"
          />

          <Button
            onPress={submit}
            isLoading={loading}
            isDisabled={loading}
            colorScheme="blue"
            size="lg"
          >
            {signup ? 'Create Account' : 'Login'}
          </Button>

          <Pressable
            onPress={() => setSignup(!signup)}
            alignItems="center"
          >
            <Text color="blue.600">
              {signup
                ? 'Already have an account? Login'
                : "Don't have an account? Sign up"}
            </Text>
          </Pressable>
        </VStack>
      </Box>
    </Box>
  );
}
