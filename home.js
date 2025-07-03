// screens/HomeScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [faturalar, setFaturalar] = useState([]);
  const [harcamalar, setHarcamalar] = useState([]);
  const [toplamBuAy, setToplamBuAy] = useState('0.00');
  const [yuzdeDegisim, setYuzdeDegisim] = useState('0.00');
  const [uyariFaturalari, setUyariFaturalari] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userList, setUserList] = useState([]);

  const loadCurrentUser = async () => {
    try {
      const userString = await AsyncStorage.getItem('currentUser');
      if (userString) setCurrentUser(JSON.parse(userString));
      else setCurrentUser(null);
    } catch (e) {
      setCurrentUser(null);
    }
  };

  const loadUsers = async () => {
    try {
      const usersJSON = await AsyncStorage.getItem('users');
      const users = usersJSON ? JSON.parse(usersJSON) : [];
      setUserList(users);
    } catch (e) {
      console.log('Kullanıcılar yüklenemedi', e);
    }
  };

  const loadData = async () => {
    if (!currentUser) {
      setFaturalar([]);
      setHarcamalar([]);
      return;
    }

    const faturaKey = `@faturalar_${currentUser.email}`;
    const harcamaKey = `@harcamalar_${currentUser.email}`;

    try {
      const fData = await AsyncStorage.getItem(faturaKey);
      const hData = await AsyncStorage.getItem(harcamaKey);

      setFaturalar(fData ? JSON.parse(fData) : []);
      setHarcamalar(hData ? JSON.parse(hData) : []);
    } catch (e) {
      setFaturalar([]);
      setHarcamalar([]);
    }
  };

  const handleLogoutConfirm = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesaptan çıkmak istediğinize emin misiniz?',
      [
        { text: 'Hayır', style: 'cancel' },
        {
          text: 'Evet',
          onPress: async () => {
            await AsyncStorage.removeItem('currentUser');
            setModalVisible(false);
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const handleAddAccount = () => {
    setModalVisible(false);
    navigation.navigate('Login');
  };

  const calculate = () => {
    const now = new Date();
    const buAy = now.getMonth();
    const buYil = now.getFullYear();
    const gecenAy = buAy === 0 ? 11 : buAy - 1;
    const gecenAyYil = buAy === 0 ? buYil - 1 : buYil;

    let toplamAy = 0;
    let toplamGecen = 0;
    const yaklasan = [];

    faturalar.forEach(f => {
      const t = new Date(f.tarih);
      const m = parseFloat(f.miktar) || 0;

      if (!f.odendiMi) {
        const diff = Math.floor((t - now) / (1000 * 60 * 60 * 24));
        if (diff >= 0 && diff <= 3) yaklasan.push(f);
      }

      if (f.odendiMi) {
        if (t.getMonth() === buAy && t.getFullYear() === buYil) toplamAy += m;
        if (t.getMonth() === gecenAy && t.getFullYear() === gecenAyYil) toplamGecen += m;
      }
    });

    harcamalar.forEach(h => {
      const t = new Date(h.tarih);
      const m = parseFloat(h.miktar) || 0;
      if (t.getMonth() === buAy && t.getFullYear() === buYil) toplamAy += m;
      if (t.getMonth() === gecenAy && t.getFullYear() === gecenAyYil) toplamGecen += m;
    });

    setToplamBuAy(toplamAy.toFixed(2));

    const deg =
      toplamGecen === 0
        ? toplamAy === 0
          ? 0
          : 100
        : ((toplamAy - toplamGecen) / toplamGecen) * 100;

    setYuzdeDegisim(deg.toFixed(2));
    setUyariFaturalari(yaklasan);
  };

  useFocusEffect(
    useCallback(() => {
      loadCurrentUser();
      loadUsers();
    }, [])
  );

  useEffect(() => {
    if (currentUser) {
      loadData();
    } else {
      setFaturalar([]);
      setHarcamalar([]);
    }
  }, [currentUser]);

  useEffect(() => {
    calculate();
  }, [faturalar, harcamalar]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{ paddingRight: 12 }}
        >
          <Text style={{ fontSize: 24 }}>≡</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={[styles.flexOne, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <HomeButton title="Fatura Ekle" onPress={() => navigation.navigate('addbill', { currentUser })} />
        <HomeButton title="Harcamalarım" onPress={() => navigation.navigate('expenses', { currentUser })} />
        <HomeButton title="Listele" onPress={() => navigation.navigate('list', { currentUser })} />
        <HomeButton title="Grafik" onPress={() => navigation.navigate('chart', { currentUser })} />

        <YaklasanFaturalar list={uyariFaturalari} />
        <HarcamaOzeti buAy={toplamBuAy} degisim={yuzdeDegisim} />
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {currentUser && (
              <TouchableOpacity style={styles.modalItem} onPress={handleLogoutConfirm}>
                <Text style={styles.modalUsername}>Kullanıcı: {currentUser.username}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.modalItem} onPress={handleAddAccount}>
              <Text style={[styles.modalItemText, { color: '#3a86ff' }]}>
                Yeni Hesap Ekle
              </Text>
            </TouchableOpacity>

            {userList.length > 1 && (
              <>
                <Text style={{ fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>
                  Hesaplar:
                </Text>
                {userList.map((u, i) => (
                  <TouchableOpacity
                    key={i}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor:
                        currentUser && u.email === currentUser.email ? '#d0ebff' : '#f0f0f0',
                      borderRadius: 8,
                      marginBottom: 6,
                    }}
                    onPress={async () => {
                      await AsyncStorage.setItem('currentUser', JSON.stringify(u));
                      setCurrentUser(u);
                      setModalVisible(false);
                    }}
                  >
                    <Text>
                      {u.username} {u.email === currentUser?.email ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function HomeButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

function YaklasanFaturalar({ list }) {
  return (
    <View style={styles.notificationBox}>
      <Text style={styles.sectionTitle}>Yaklaşan Faturalar:</Text>
      {list.length ? (
        list.map((f, i) => (
          <Text key={i} style={styles.notificationText}>
            {f.baslik || 'Fatura'} · {new Date(f.tarih).toLocaleDateString()}
          </Text>
        ))
      ) : (
        <Text style={styles.notificationText}>Yaklaşan fatura yok.</Text>
      )}
    </View>
  );
}

function HarcamaOzeti({ buAy, degisim }) {
  return (
    <View style={styles.footerBox}>
      <Text style={styles.sectionTitle}>Bu Ay Toplam Harcama : {buAy} TL</Text>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: parseFloat(degisim) >= 0 ? 'green' : 'red',
            marginTop: 12,
          },
        ]}
      >
        Geçen Aya Göre Değişim : {parseFloat(degisim) >= 0 ? '+' : ''}
        {degisim}%
      </Text>
    </View>
  );
}

const BLUE = '#E6F2FF';

const styles = StyleSheet.create({
  flexOne: { flex: 1 },
  scrollContent: { padding: 20 },
  button: {
    backgroundColor: BLUE,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    width: '100%',
  },
  buttonText: {
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    fontSize: 16,
    textAlign: 'left',
  },
  notificationBox: {
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 20,
    minHeight: 120,
    marginBottom: 30,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    fontSize: 16,
  },
  notificationText: {
    fontFamily: 'SpaceMono',
    fontSize: 14,
    marginTop: 6,
  },
  footerBox: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    padding: 24,
    marginBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingVertical: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 20,
    position: 'relative',
  },
  modalItem: {
    paddingVertical: 15,
  },
  modalUsername: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'normal',
  },
  modalItemText: {
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333',
  },
});
