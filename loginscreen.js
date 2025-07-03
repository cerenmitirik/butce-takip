// screens/LoginScreen.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true); // Giriş mi kayıt mı

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Hata', 'Lütfen e-posta ve şifreyi girin.');
      return;
    }

    try {
      const existingUsersJSON = await AsyncStorage.getItem('users');
      const users = existingUsersJSON ? JSON.parse(existingUsersJSON) : [];

      const user = users.find(
        u =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      );

      if (!user) {
        Alert.alert('Hata', 'Geçersiz e-posta veya şifre.');
        return;
      }

      await AsyncStorage.setItem('currentUser', JSON.stringify(user));
      navigation.replace('Home', { currentUser: user });
    } catch (e) {
      Alert.alert('Hata', 'Giriş yapılırken bir hata oluştu.');
      console.error(e);
    }
  };

  const handleCreateAccount = async () => {
    if (!email.trim() || !username.trim() || !password.trim()) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    const user = { email: email.trim(), username: username.trim(), password };

    try {
      const existingUsersJSON = await AsyncStorage.getItem('users');
      const users = existingUsersJSON ? JSON.parse(existingUsersJSON) : [];

      // E-posta tekrar kontrolü
      if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
        Alert.alert('Hata', 'Bu e-posta zaten kayıtlı.');
        return;
      }

      const updatedUsers = [...users, user];
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));

      navigation.replace('Home', { currentUser: user });
    } catch (e) {
      Alert.alert('Hata', 'Hesap oluşturulurken bir hata oluştu.');
      console.error(e);
    }
  };

  const handleSubmit = () => {
    if (isLoginMode) {
      handleLogin();
    } else {
      handleCreateAccount();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchRow}>
        <TouchableOpacity onPress={() => setIsLoginMode(true)}>
          <Text style={[styles.switchText, isLoginMode && styles.selected]}>
            Giriş Yap
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLoginMode(false)}>
          <Text style={[styles.switchText, !isLoginMode && styles.selected]}>
            Hesap Oluştur
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>
        {isLoginMode ? 'Giriş Yap' : 'Hesap Oluştur'}
      </Text>

      <TextInput
        placeholder="E-posta"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {!isLoginMode && (
        <TextInput
          placeholder="Kullanıcı Adı"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      )}

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Şifre"
          style={styles.passwordInput}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isLoginMode ? 'Giriş Yap' : 'Hesap Oluştur'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, marginBottom: 12,
  },
  passwordContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    paddingHorizontal: 12, marginBottom: 16,
  },
  passwordInput: { flex: 1, paddingVertical: 12 },
  button: {
    backgroundColor: '#3a86ff', padding: 12, borderRadius: 8,
  },
  buttonText: {
    color: '#fff', textAlign: 'center', fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row', justifyContent: 'center', marginBottom: 16,
  },
  switchText: {
    marginHorizontal: 16, fontSize: 16, color: '#888',
  },
  selected: {
    fontWeight: 'bold', color: '#3a86ff', textDecorationLine: 'underline',
  },
});
