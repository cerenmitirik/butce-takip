import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const BLUE = '#E6F2FF';
const BOX_GAP = 8;
const BOX_PAD = 8;
const PICKER_H = 56;

export default function ListScreen({ route, navigation }) {
  const currentUser = route.params?.currentUser;

  const [bills, setBills] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [viewData, setViewData] = useState([]);

  const [master, setMaster] = useState('Hepsi');
  const [dateFilter, setDateFilter] = useState('Hepsi');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState('start');
  const [startD, setStartD] = useState(new Date());
  const [endD, setEndD] = useState(new Date());
  const [minAmt, setMinAmt] = useState('');
  const [maxAmt, setMaxAmt] = useState('');
  const [subCat, setSubCat] = useState('');

  const billCats = ['Su', 'Elektrik', 'Doğalgaz', 'Kira', 'Telefon', 'Diğer'];
  const expCats = ['Market', 'Alışveriş', 'Eğlence', 'Sosyal', 'Ulaşım', 'Diğer'];

  useEffect(() => {
    navigation.setOptions({ title: 'Listeleme' });
  }, [navigation]);

  const load = async () => {
    if (!currentUser?.email) {
      Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı.');
      navigation.goBack();
      return;
    }
    try {
      const b = await AsyncStorage.getItem(`@faturalar_${currentUser.email}`);
      const e = await AsyncStorage.getItem(`@harcamalar_${currentUser.email}`);
      setBills(b ? JSON.parse(b) : []);
      setExpenses(e ? JSON.parse(e) : []);
    } catch (error) {
      Alert.alert('Hata', 'Veriler yüklenirken sorun oluştu.');
    }
  };

  const filter = useCallback(() => {
    let data =
      master === 'Faturalar'
        ? bills
        : master === 'Harcamalar'
        ? expenses
        : [...bills, ...expenses];
    const now = new Date();
    data = data
      .filter((it) => {
        const t = new Date(it.tarih);
        if (dateFilter === '7G') return now - t <= 7 * 864e5;
        if (dateFilter === 'BUAY')
          return t.getMonth() === now.getMonth() && t.getFullYear() === now.getFullYear();
        if (dateFilter === 'CUSTOM') return t >= startD && t <= endD;
        return true;
      })
      .filter((it) => {
        const m = parseFloat(it.miktar) || 0;
        const okMin = minAmt ? m >= parseFloat(minAmt) : true;
        const okMax = maxAmt ? m <= parseFloat(maxAmt) : true;
        return okMin && okMax;
      });
    if (subCat) data = data.filter((it) => (it.kategori || it.baslik) === subCat);
    data.sort((a, b) => new Date(b.tarih) - new Date(a.tarih));
    setViewData(data);
  }, [bills, expenses, master, dateFilter, startD, endD, minAmt, maxAmt, subCat]);
  useFocusEffect(useCallback(() => {
    load();
  }, [currentUser]));
  useEffect(() => {
    filter();
  }, [filter]);
  const togglePaid = async (id, s) => {
    const upd = bills.map((b) => (b.id === id ? { ...b, odendiMi: s } : b));
    setBills(upd);
    try {
      await AsyncStorage.setItem(`@faturalar_${currentUser.email}`, JSON.stringify(upd));
    } catch (e) {
      Alert.alert('Hata', 'Fatura durumu kaydedilemedi.');
    }
  };

  const renderRow = ({ item }) => {
    const bill = item.hasOwnProperty('odendiMi');
    return (
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.rTitle}>{item.baslik || item.kategori}</Text>
          <Text style={styles.rSub}>
            {new Date(item.tarih).toLocaleDateString()} · {parseFloat(item.miktar).toFixed(2)} TL
          </Text>
        </View>
        {bill && (
          <Pressable
            style={[styles.chk, item.odendiMi && styles.chkOn]}
            onPress={() => togglePaid(item.id, !item.odendiMi)}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxSm}>
        <Text style={styles.bTitle}>Kayıt Türü</Text>
        <Picker
          selectedValue={master}
          onValueChange={(v) => {
            setMaster(v);
            setSubCat('');
          }}
          style={styles.picker}
        >
          <Picker.Item label="Hepsi" value="Hepsi" />
          <Picker.Item label="Faturalar" value="Faturalar" />
          <Picker.Item label="Harcamalar" value="Harcamalar" />
        </Picker>
      </View>

      <View style={styles.boxSm}>
        <Text style={styles.bTitle}>Tarih Filtresi</Text>
        <Picker
          selectedValue={dateFilter}
          onValueChange={(v) => {
            setDateFilter(v);
            if (v !== 'CUSTOM') setPickerVisible(false);
          }}
          style={styles.picker}
        >
          <Picker.Item label="Hepsi" value="Hepsi" />
          <Picker.Item label="Son 7 Gün" value="7G" />
          <Picker.Item label="Bu Ay" value="BUAY" />
          <Picker.Item label="Özel Aralık" value="CUSTOM" />
        </Picker>
        {dateFilter === 'CUSTOM' && (
          <View style={styles.dateRow}>
            <Pressable
              style={styles.dateBtn}
              onPress={() => {
                setPickerTarget('start');
                setPickerVisible(true);
              }}
            >
              <Text>{startD.toLocaleDateString()}</Text>
            </Pressable>
            <Text> - </Text>
            <Pressable
              style={styles.dateBtn}
              onPress={() => {
                setPickerTarget('end');
                setPickerVisible(true);
              }}
            >
              <Text>{endD.toLocaleDateString()}</Text>
            </Pressable>
          </View>
        )}
      </View>

      {pickerVisible && (
        <DateTimePicker
          value={pickerTarget === 'start' ? startD : endD}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, sel) => {
            if (!sel) {
              setPickerVisible(false);
              return;
            }
            pickerTarget === 'start' ? setStartD(sel) : setEndD(sel);
            setPickerVisible(false);
          }}
        />
      )}

      <View style={styles.boxSm}>
        <Text style={styles.bTitle}>Tutara Göre Listele (TL)</Text>
        <View style={styles.amountRow}>
          <TextInput
            style={styles.aInput}
            placeholder="Min"
            value={minAmt}
            keyboardType="numeric"
            onChangeText={setMinAmt}
          />
          <Text> - </Text>
          <TextInput
            style={styles.aInput}
            placeholder="Max"
            value={maxAmt}
            keyboardType="numeric"
            onChangeText={setMaxAmt}
          />
          <Pressable style={styles.fBtn} onPress={filter}>
            <Text>Filtrele</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.boxSm}>
        <Text style={styles.bTitle}>Kategoriye Göre</Text>
        {master === 'Hepsi' ? (
          <Text style={styles.info}>Önce kayıt türü seçin</Text>
        ) : (
          <Picker
            selectedValue={subCat}
            onValueChange={setSubCat}
            style={styles.picker}
          >
            <Picker.Item label="Tümü" value="" />
            {(master === 'Faturalar' ? billCats : expCats).map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        )}
      </View>

      <View style={styles.boxLg}>
        <FlatList
          data={viewData}
          renderItem={renderRow}
          keyExtractor={(it) => it.id}
          ListEmptyComponent={<Text style={styles.info}>Kayıt yok</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: BOX_GAP },
  boxSm: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: BOX_PAD,
    marginBottom: BOX_GAP,
  },
  boxLg: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: BOX_PAD,
    marginBottom: BOX_GAP,
  },
  bTitle: { fontWeight: 'bold', marginBottom: 4 },
  picker: { height: PICKER_H, width: '100%' },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  dateBtn: {
    backgroundColor: BLUE,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  amountRow: { flexDirection: 'row', alignItems: 'center' },
  aInput: {
    borderWidth: 1,
    borderColor: '#AAA',
    borderRadius: 6,
    padding: 6,
    width: 70,
    textAlign: 'center',
  },
  fBtn: {
    backgroundColor: BLUE,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#DDD',
    paddingVertical: 6,
  },
  rTitle: { fontWeight: 'bold' },
  rSub: { fontSize: 12, color: '#555' },
  chk: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 4,
  },
  chkOn: { backgroundColor: '#4caf50' },
  info: { fontSize: 12, color: '#666', marginTop: 4 },
});
