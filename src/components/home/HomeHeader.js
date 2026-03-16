import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/HomeScreen.styles';

export default function HomeHeader({ user, logout }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {user?.NameFirst?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.greeting}>Welcome back,</Text>
      <Text style={styles.name}>{user?.NameFull ?? 'Student'} 👋</Text>
      <Text style={styles.org}>{user?.FacilityName ?? ''}</Text>
    </View>
  );
}
