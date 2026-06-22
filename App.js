import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import {
  useFonts,
  Heebo_400Regular,
  Heebo_500Medium,
  Heebo_700Bold,
  Heebo_800ExtraBold,
} from '@expo-google-fonts/heebo';

import HomeScreen from './src/screens/HomeScreen';
import QuoteBuilderScreen from './src/screens/QuoteBuilderScreen';
import RatesScreen from './src/screens/RatesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ClientsScreen from './src/screens/ClientsScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import AuthScreen from './src/screens/AuthScreen';
import { colors } from './src/theme/colors';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { LanguageProvider, useLanguage } from './src/contexts/LanguageContext';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    primary: colors.primarySeed,
    card: colors.bgSoft,
    text: colors.text,
    border: colors.dividerDark,
  },
};

function MainTabs() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryBright,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.bgSoft,
          borderTopColor: colors.dividerDark,
          height: 60 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
        tabBarIcon: ({ color, size }) => {
          const name =
            route.name === 'Home' ? 'home' :
            route.name === 'Quote' ? 'add-circle' :
            route.name === 'Calendar' ? 'event' :
            route.name === 'Clients' ? 'contacts' :
            route.name === 'Rates' ? 'tune' :
            'settings';
          return <MaterialIcons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: t('tabs.home') }} />
      <Tab.Screen name="Quote" component={QuoteBuilderScreen} options={{ tabBarLabel: t('tabs.quote') }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: t('tabs.calendar') }} />
      <Tab.Screen name="Clients" component={ClientsScreen} options={{ tabBarLabel: t('tabs.clients') }} />
      <Tab.Screen name="Rates" component={RatesScreen} options={{ tabBarLabel: t('tabs.rates') }} />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('tabs.settings'),
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
}

function AppGate() {
  const { user, loading } = useAuth();
  const { ready: langReady } = useLanguage();
  if (loading || !langReady) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primarySeed} />
      </View>
    );
  }
  return user ? <MainTabs /> : <AuthScreen />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Heebo_400Regular,
    Heebo_500Medium,
    Heebo_700Bold,
    Heebo_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primarySeed} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <LanguageProvider>
        <AuthProvider>
          <NavigationContainer theme={navTheme}>
            <AppGate />
          </NavigationContainer>
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});
