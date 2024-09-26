// Column.js

import React, {useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import HeaderInfoCard from '../Cards/HeaderInfoCard';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const Column = ({data, renderCard, headerInfo, onHeaderPress, onAddCard}) => {
  const memoizedHeaderInfoCard = useMemo(
    () =>
      headerInfo && (
        <HeaderInfoCard headerInfo={headerInfo} onPress={onHeaderPress} />
      ),
    [headerInfo, onHeaderPress],
  );

  const memoizedCards = useMemo(() => data.map(renderCard), [data, renderCard]);

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <View style={styles.header}>
          {onAddCard && (
            <TouchableOpacity
              onPress={onAddCard}
              style={styles.addIconContainer}>
              <Icon name="add-circle" size={24} color="#007AFF" />
            </TouchableOpacity>
          )}
        </View>
        {memoizedHeaderInfoCard}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {memoizedCards}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 10,
  },
  column: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addIconContainer: {
    marginLeft: 10,
  },
  scrollViewContent: {
    paddingBottom: 10,
  },
});

export default Column;
