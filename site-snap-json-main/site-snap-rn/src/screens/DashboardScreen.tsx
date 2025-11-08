import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/AppNavigator';
import { Navigation } from '../components/Navigation';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { colors, spacing, fontSize, shadows } from '../theme';
import { dataService, Analytics } from '../services/dataService';
import { LinearGradient } from 'expo-linear-gradient';
import { VictoryChart, VictoryArea, VictoryAxis } from 'victory-native';
import { Eye, MessageCircle, TrendingUp } from 'lucide-react-native';

type DashboardScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'Dashboard'>;

const screenWidth = Dimensions.get('window').width;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const [timePeriod, setTimePeriod] = useState<'15days' | '30days' | '6months' | '1year'>('15days');
  const [productPeriod, setProductPeriod] = useState<'lastDay' | 'lastWeek' | 'lastMonth' | 'allTime'>('lastMonth');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const analyticsData = await dataService.getAnalytics();
    setAnalytics(analyticsData);
  };

  const getChartData = () => {
    if (!analytics) return [];
    
    switch (timePeriod) {
      case '15days':
        return analytics.visitorData.last15Days;
      case '30days':
        return analytics.visitorData.last30Days;
      case '6months':
        return analytics.visitorData.last6Months;
      case '1year':
        return analytics.visitorData.lastYear;
      default:
        return analytics.visitorData.last15Days;
    }
  };

  const getProductData = () => {
    if (!analytics) return [];
    
    switch (productPeriod) {
      case 'lastDay':
        return analytics.productPerformance.lastDay;
      case 'lastWeek':
        return analytics.productPerformance.lastWeek;
      case 'lastMonth':
        return analytics.productPerformance.lastMonth;
      case 'allTime':
        return analytics.productPerformance.allTime;
      default:
        return analytics.productPerformance.lastMonth;
    }
  };

  if (!analytics) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const stats = [
    {
      label: 'Total Visitors',
      value: analytics.totalVisitors,
      icon: Eye,
      color: colors.primary,
      bgColor: colors.primary + '1A',
    },
    {
      label: 'WhatsApp Inquiries',
      value: analytics.whatsappInquiries,
      icon: MessageCircle,
      color: colors.accent,
      bgColor: colors.accent + '1A',
    },
    {
      label: 'Product Views',
      value: analytics.productViews,
      icon: TrendingUp,
      color: colors.primary,
      bgColor: colors.primary + '1A',
    },
  ];

  return (
    <LinearGradient colors={['#FAFAFA', '#F5F5F5']} style={styles.container}>
      <Navigation />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Track your business performance</Text>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={[styles.statIconContainer, { backgroundColor: stat.bgColor }]}>
                  <stat.icon size={24} color={stat.color} strokeWidth={1.5} />
                </View>
              </View>
              <Text style={styles.statValue}>{stat.value.toLocaleString()}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Visitor Analytics</Text>
            <View style={styles.periodButtons}>
              {[
                { value: '15days', label: '15 Days' },
                { value: '30days', label: '30 Days' },
                { value: '6months', label: '6 Months' },
                { value: '1year', label: '1 Year' }
              ].map((period) => (
                <TouchableOpacity
                  key={period.value}
                  style={[
                    styles.periodButton,
                    timePeriod === period.value && styles.periodButtonActive,
                  ]}
                  onPress={() => setTimePeriod(period.value as any)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      timePeriod === period.value && styles.periodButtonTextActive,
                    ]}
                  >
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {getChartData().length > 0 ? (
            <View style={styles.chartContainer}>
              <VictoryChart
                width={screenWidth}
                height={300}
                padding={{ left: 50, right: 30, top: 20, bottom: 50 }}
              >
                <VictoryAxis
                  style={{
                    axis: { stroke: colors.border },
                    grid: { stroke: colors.border, strokeDasharray: '3,3' },
                    tickLabels: { 
                      fontSize: 10, 
                      fill: colors.mutedForeground,
                      padding: 5,
                      angle: -45,
                      textAnchor: 'end',
                    },
                  }}
                  fixLabelOverlap
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    axis: { stroke: colors.border },
                    grid: { stroke: colors.border, strokeDasharray: '3,3' },
                    tickLabels: { 
                      fontSize: 10, 
                      fill: colors.mutedForeground,
                      padding: 5
                    },
                  }}
                />
                <VictoryArea
                  data={getChartData()}
                  x="date"
                  y="visitors"
                  interpolation="monotoneX"
                  style={{
                    data: {
                      fill: `${colors.primary}4D`,
                      stroke: colors.primary,
                      strokeWidth: 2,
                    },
                  }}
                />
              </VictoryChart>
            </View>
          ) : (
            <Text style={styles.noDataText}>No visitor data yet</Text>
          )}
        </Card>

        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Product Performance</Text>
            <View style={styles.periodButtons}>
              {[
                { value: 'lastDay', label: 'Last Day' },
                { value: 'lastWeek', label: 'Last Week' },
                { value: 'lastMonth', label: 'Last Month' },
                { value: 'allTime', label: 'All Time' }
              ].map((period) => (
                <TouchableOpacity
                  key={period.value}
                  style={[
                    styles.periodButton,
                    productPeriod === period.value && styles.periodButtonActive,
                  ]}
                  onPress={() => setProductPeriod(period.value as any)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      productPeriod === period.value && styles.periodButtonTextActive,
                    ]}
                  >
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {getProductData().length > 0 ? (
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.productNameColumn]}>Product Name</Text>
                <Text style={[styles.tableHeaderText, styles.tableColumn]}>Views</Text>
                <Text style={[styles.tableHeaderText, styles.tableColumn]}>Clicks</Text>
                <Text style={[styles.tableHeaderText, styles.tableColumn]}>Inquiries</Text>
                <Text style={[styles.tableHeaderText, styles.tableColumn]}>Conversion</Text>
              </View>
              <ScrollView style={styles.tableScroll}>
                {getProductData().map((product, index) => (
                  <View key={product.id} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.productNameColumn, styles.productNameText]} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <View style={[styles.tableColumn, styles.iconCell]}>
                      <Eye size={14} color={index < 3 ? colors.primary : colors.mutedForeground} />
                      <Text style={styles.tableCellText}>{product.views}</Text>
                    </View>
                    <Text style={[styles.tableCell, styles.tableColumn]}>{product.clicks}</Text>
                    <View style={[styles.tableColumn, styles.iconCell]}>
                      <MessageCircle size={14} color={index < 3 ? colors.primary : colors.mutedForeground} />
                      <Text style={styles.tableCellText}>{product.inquiries}</Text>
                    </View>
                    <View style={[styles.tableColumn, styles.badgeCell]}>
                      <Badge variant={index < 3 ? 'default' : 'secondary'}>
                        <Text style={styles.badgeText}>{product.conversionRate}%</Text>
                      </Badge>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : (
            <Text style={styles.noDataText}>No product data yet. Start adding products to see performance insights!</Text>
          )}
        </Card>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: fontSize.lg,
    color: colors.mutedForeground,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    maxWidth: 896,
    width: '100%',
    alignSelf: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl * 3,
  },
  titleContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.mutedForeground,
  },
  statsGrid: {
    flexDirection: 'column',
    gap: spacing.md,
    marginBottom: spacing.xl * 2,
    paddingHorizontal: spacing.xl,
  },
  statCard: {
    width: '100%',
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  statIconContainer: {
    padding: 12,
    borderRadius: 16,
  },
  statValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  chartCard: {
    paddingVertical: spacing.xl,
    marginBottom: spacing.xl * 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartHeader: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing.md,
  },
  periodButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  periodButton: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: 6,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 2,
    marginBottom: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodButtonText: {
    fontSize: fontSize.sm,
    color: colors.foreground,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: colors.primaryForeground,
    fontWeight: '600',
  },
  chartContainer: {
    marginTop: spacing.md,
  },
  noDataText: {
    textAlign: 'center',
    color: colors.mutedForeground,
    paddingVertical: spacing.xl * 3,
    fontSize: fontSize.sm,
  },
  tableContainer: {
    marginTop: spacing.md,
  },
  tableScroll: {
    maxHeight: 400,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.muted + '40',
  },
  tableHeaderText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.foreground,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '40',
    alignItems: 'center',
  },
  productNameColumn: {
    flex: 2.5,
    paddingRight: spacing.sm,
  },
  tableColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  tableCell: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  productNameText: {
    fontWeight: '500',
    color: colors.foreground,
    textAlign: 'left',
    fontSize: fontSize.xs,
  },
  iconCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCellText: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    marginLeft: 4,
  },
  badgeCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
});

export default DashboardScreen;
