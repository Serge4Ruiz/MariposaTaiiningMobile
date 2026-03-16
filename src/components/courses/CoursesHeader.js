import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/CoursesScreen.styles';

export default function CoursesHeader({ user, logout, searchQuery, onSearchChange, loading, filteredCount }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.NameFirst ?? 'Student'}</Text>
          <Text style={styles.headerTitle}>Course Catalog</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color="#9099b2" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color="#9099b2" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses or instructors..."
          placeholderTextColor="#9099b2"
          value={searchQuery}
          onChangeText={onSearchChange}
          returnKeyType="search"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Ionicons name="close-circle" size={18} color="#6b7399" />
          </TouchableOpacity>
        )}
      </View>

      {!loading && (
        <Text style={styles.resultCount}>
          {filteredCount} course{filteredCount !== 1 ? 's' : ''}
          {searchQuery ? ' found' : ' available'}
        </Text>
      )}
    </View>
  );
}
