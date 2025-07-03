import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const userStr = await AsyncStorage.getItem('currentUser');
        if (userStr) {
          const user = JSON.parse(userStr);
          navigation.replace('Home', { currentUser: user }); // currentUser parametre olarak gönderiliyor
        } else {
          navigation.replace('Login');
        }
      } catch (e) {
        console.log('Giriş kontrol hatası:', e);
        navigation.replace('Login');
      }
    };

    const timeout = setTimeout(checkLogin, 4000); // Senin süreyi korudum

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/images/butce.png')}
        style={styles.logo}
        resizeMode="cover" // Bu senin orijinal hali
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
