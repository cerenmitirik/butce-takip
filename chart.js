import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";

const { width: WINDOW_WIDTH } = Dimensions.get("window");
const CONTENT_PADDING = 16;
const CONTENT_WIDTH = WINDOW_WIDTH - CONTENT_PADDING * 2;
const BOX_WIDTH = (CONTENT_WIDTH - 16) / 2;
const PIE_SIZE = Math.min(BOX_WIDTH * 0.9, 140);
const PIE_CENTER_X = (BOX_WIDTH - PIE_SIZE) / 2 *2.5 ;//DİNAMİK OLARAK SAĞA KAYDRDIM 
const CHART_HEIGHT = 220;
const COLORS = ["#4caf50", "#ff9800", "#2196f3", "#e91e63", "#9c27b0", "#ffc107"];

const getMonthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const getMonthDisplay = (k) => k.split("-").reverse().join("-");
const getShortLabel = (k) => `${k.slice(5, 7)}-${k.slice(2, 4)}`;

export default function ChartScreen({ route }) {
  const currentUser = route.params?.currentUser;
  const [bills, setBills] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [compMode, setCompMode] = useState("Harcamalar");
  const [monthA, setMonthA] = useState(getMonthKey(new Date()));
  const [monthB, setMonthB] = useState(getMonthKey(new Date()));
  const [barMode, setBarMode] = useState("Harcamalar");
  const [barCategory, setBarCategory] = useState("Market");
  const [refreshing, setRefreshing] = useState(false);

  const BILL_CATS = ["Kira", "Telefon", "Su", "Elektrik", "Doğalgaz", "Diğer"];
  const EXP_CATS = ["Market", "Alışveriş", "Sosyal", "Eğlence", "Ulaşım", "Diğer"];

  const loadData = async () => {
    const rawBills = await AsyncStorage.getItem(`@faturalar_${currentUser.email}`);
    const rawExps = await AsyncStorage.getItem(`@harcamalar_${currentUser.email}`);
    setBills((JSON.parse(rawBills) || []).filter((b) => b.odendiMi));
    setExpenses(JSON.parse(rawExps) || []);
  };

  useEffect(() => {
    if (currentUser?.email) loadData();
  }, [currentUser]);

  const groupBy = (list, cats) => {
    const map = Object.fromEntries(cats.map((c) => [c, 0]));
    list.forEach((item) => {
      const cat = item.kategori || item.category || "Diğer";
      map[cat] = (map[cat] || 0) + (parseFloat(item.miktar) || 0);
    });
    return Object.entries(map).filter(([, v]) => v > 0);
  };

  const slice = (name, amount, idx) => ({
    name,
    amount,
    color: COLORS[idx % COLORS.length],
    legendFontColor: "#000",
    legendFontSize: 13,
  });

  const thisMonthKey = getMonthKey(new Date());
  const pieBills = groupBy(
    bills.filter((b) => getMonthKey(new Date(b.tarih)) === thisMonthKey),
    BILL_CATS
  ).map(([k, v], i) => slice(k, v, i));

  const pieExp = groupBy(
    expenses.filter((e) => getMonthKey(new Date(e.tarih)) === thisMonthKey),
    EXP_CATS
  ).map(([k, v], i) => slice(k, v, i));

  const cmpCats = compMode === "Harcamalar" ? EXP_CATS : BILL_CATS;
  const cmpSrc = compMode === "Harcamalar" ? expenses : bills;

  const cmpPieA = groupBy(
    cmpSrc.filter((x) => getMonthKey(new Date(x.tarih)) === monthA),
    cmpCats
  ).map(([k, v], i) => slice(k, v, i));

  const cmpPieB = groupBy(
    cmpSrc.filter((x) => getMonthKey(new Date(x.tarih)) === monthB),
    cmpCats
  ).map(([k, v], i) => slice(k, v, i));

  const explanation = () => {
    const totA = cmpPieA.reduce((s, c) => s + c.amount, 0);
    const totB = cmpPieB.reduce((s, c) => s + c.amount, 0);
    if (!totA && !totB) return "";
    const diff = totB - totA;
    const word = diff > 0 ? "fazla" : "az";

    const diffMap = {};
    cmpCats.forEach((cat) => {
      const a = cmpPieA.find((o) => o.name === cat)?.amount || 0;
      const b = cmpPieB.find((o) => o.name === cat)?.amount || 0;
      diffMap[cat] = b - a;
    });
    const maxCat = Object.entries(diffMap).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0][0];

    return `${getMonthDisplay(monthB)} ayında ${getMonthDisplay(
      monthA
    )} ayına göre ${Math.abs(diff).toLocaleString("tr-TR")}TL ${word} ${compMode.toLowerCase()} yapılmıştır. En çok değişim “${maxCat}” kategorisindedir.`;
  };

  const months6 = Array.from({ length: 6 })
    .map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return getMonthKey(d);
    })
    .reverse();

  const barSrc = barMode === "Harcamalar" ? expenses : bills;
  const barData = months6.map((key) =>
    barSrc
      .filter(
        (x) =>
          (barMode === "Harcamalar" || x.odendiMi) &&
          (x.kategori || x.category) === barCategory &&
          getMonthKey(new Date(x.tarih)) === key
      )
      .reduce((s, c) => s + (parseFloat(c.miktar) || 0), 0)
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const monthItems = (prefix = "") => {
    return Array.from({ length: 24 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const k = getMonthKey(d);
      const label = getMonthDisplay(k);
      return <Picker.Item key={`${prefix}-${i}`} label={label} value={k} />;
    });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingBottom: 96 }}
    >
      <Text style={styles.head}>Bu Ayın Dağılımı</Text>
      <View style={styles.rowBetween}>
        {[{ title: "Harcamalar", data: pieExp }, { title: "Faturalar", data: pieBills }].map(
          ({ title, data }) => (
            <View key={title} style={styles.box}>
              <Text style={styles.sub}>{title}</Text>
              {data.length ? (
                <>
                  <View style={styles.chartContainer}>
                    <PieChart
                      data={data}
                      width={PIE_SIZE}
                      height={PIE_SIZE}
                      accessor="amount"
                      chartConfig={chartCfg}
                      hasLegend={false}
                      backgroundColor="transparent"
                      center={[PIE_CENTER_X, 0]}
                    />
                  </View>
                  <View style={styles.legendWrap}>
                    {data.map((item, i) => (
                      <View key={i} style={styles.legendRow}>
                        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                        <Text style={styles.legendText}>
                          {`${item.name}: ${item.amount.toLocaleString("tr-TR")}₺`}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <Text style={styles.empty}>Veri Yok</Text>
              )}
            </View>
          )
        )}
      </View>

      <Text style={styles.head}>Aya Göre Kıyaslama</Text>
      <View style={styles.pickerRow}>
        <Picker style={styles.picker} selectedValue={compMode} onValueChange={setCompMode}>
          <Picker.Item label="Harcamalar" value="Harcamalar" />
          <Picker.Item label="Faturalar" value="Faturalar" />
        </Picker>
        <Picker style={styles.picker} selectedValue={monthA} onValueChange={setMonthA}>
          {monthItems("A")}
        </Picker>
        <Picker style={styles.picker} selectedValue={monthB} onValueChange={setMonthB}>
          {monthItems("B")}
        </Picker>
      </View>

      <View style={styles.rowBetween}>
        {[{ k: monthA, data: cmpPieA }, { k: monthB, data: cmpPieB }].map(({ k, data }) => (
          <View key={`cmp-${k}`} style={styles.box}>
            <Text style={styles.sub}>{getMonthDisplay(k)}</Text>
            {data.length ? (
              <>
                <View style={styles.chartContainer}>
                  <PieChart
                    data={data}
                    width={PIE_SIZE}
                    height={PIE_SIZE}
                    accessor="amount"
                    chartConfig={chartCfg}
                    hasLegend={false}
                    backgroundColor="transparent"
                    center={[PIE_CENTER_X, 0]}
                  />
                </View>
                <View style={styles.legendWrap}>
                  {data.map((item, i) => (
                    <View key={i} style={styles.legendRow}>
                      <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                      <Text style={styles.legendText}>
                        {`${item.name}: ${item.amount.toLocaleString("tr-TR")}₺`}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <Text style={styles.empty}>Veri Yok</Text>
            )}
          </View>
        ))}
      </View>

      <Text style={styles.explanation}>{explanation()}</Text>

      <Text style={styles.head}>Kategori Kıyaslama (Son 6 Ay)</Text>
      <View style={styles.pickerRow}>
        <Picker
          style={[styles.pickerHalf, { width: CONTENT_WIDTH / 2 - 8, marginRight: 8 }]}
          selectedValue={barMode}
          onValueChange={setBarMode}
        >
          <Picker.Item label="Harcamalar" value="Harcamalar" />
          <Picker.Item label="Faturalar" value="Faturalar" />
        </Picker>
        <Picker
          style={[styles.pickerHalf, { width: CONTENT_WIDTH / 2 - 8 }]}
          selectedValue={barCategory}
          onValueChange={setBarCategory}
        >
          {(barMode === "Harcamalar" ? EXP_CATS : BILL_CATS).map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <BarChart
        data={{
          labels: months6.map(getShortLabel),
          datasets: [{ data: barData }],
        }}
        width={CONTENT_WIDTH}
        height={CHART_HEIGHT}
        chartConfig={chartCfg}
        fromZero
        style={{ marginTop: 8 }}
      />
    </ScrollView>
  );
}

const chartCfg = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
  decimalPlaces: 0,
  barPercentage: 0.5,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: CONTENT_PADDING,
    backgroundColor: "#fafafa",
  },
  head: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
  },
  sub: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  box: {
    width: BOX_WIDTH,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 280,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 8,
  },
  chartContainer: {
    height: PIE_SIZE,
    width: PIE_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  legendWrap: {
    marginTop: 8,
    width: "100%",
    alignItems: "flex-start",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: "#111",
    flexShrink: 1,
    textAlign: "left",
  },
  empty: {
    color: "#999",
    fontStyle: "italic",
    fontSize: 13,
  },
  explanation: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 12,
    color: "#333",
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    flexWrap: "nowrap",
  },
  picker: {
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  pickerHalf: {
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});

