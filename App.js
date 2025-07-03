import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';

import AddBillScreen from './addbill';
import ChartScreen from './chart';
import ExpensesScreen from './expenses';
import HomeScreen from './home';
import BillListScreen from './list';
import LoginScreen from './loginscreen';
import SplashScreen from './splash';

const Stack = createNativeStackNavigator();

export default function App() {
  // Kullanıcı bilgisini global tut
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerTitleAlign: 'left' }}
      >
        {/* Splash ekranı kullanıcıyı login yönlendirsin veya doğrudan Home */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {/* Login ekranına kullanıcı ve setCurrentUser fonksiyonu geçir */}
        <Stack.Screen
          name="Login"
          options={{ title: 'Giriş Yap', headerShown: false }}
        >
          {(props) => (
            <LoginScreen
              {...props}
              onLogin={(user) => {
                setCurrentUser(user);
                props.navigation.replace('Home', { currentUser: user });
              }}
            />
          )}
        </Stack.Screen>

        {/* Home ekranına currentUser parametresi olarak geçir */}
        <Stack.Screen
          name="Home"
          options={{ title: 'Anasayfa' }}
        >
          {(props) => (
            <HomeScreen {...props} currentUser={currentUser} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="addbill"
          options={{ title: 'Fatura Ekle' }}
        >
          {(props) => (
            <AddBillScreen {...props} currentUser={currentUser} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="expenses"
          options={{ title: 'Harcamalarım' }}
        >
          {(props) => (
            <ExpensesScreen {...props} currentUser={currentUser} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="list"
          options={{ title: 'Fatura Listesi' }}
        >
          {(props) => (
            <BillListScreen {...props} currentUser={currentUser} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="chart"
          options={{ title: 'Grafikler' }}
        >
          {(props) => (
            <ChartScreen {...props} currentUser={currentUser} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

