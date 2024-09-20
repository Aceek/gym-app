import React, {useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import HeaderInfoCard from '../Cards/HeaderInfoCard';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const Column = React.memo(
  ({title, data, renderCard, headerInfo, onHeaderPress, onAddCard}) => {
    const handleAddCard = useCallback(() => {
      onAddCard && onAddCard();
    }, [onAddCard]);

    const memoizedHeaderInfoCard = useMemo(() => {
      return (
        headerInfo && (
          <HeaderInfoCard headerInfo={headerInfo} onPress={onHeaderPress} />
        )
      );
    }, [headerInfo, onHeaderPress]);

    const renderItem = useCallback(
      (item, index) => {
        return (
          <View key={item.id || index} style={styles.cardContainer}>
            {renderCard(item)}
          </View>
        );
      },
      [renderCard],
    );

    const memoizedCards = useMemo(() => {
      return data.map(renderItem);
    }, [data, renderItem]);

    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <View style={styles.header}>
            {onAddCard && (
              <TouchableOpacity
                onPress={handleAddCard}
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
  },
);

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
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  addIconContainer: {
    marginLeft: 10,
  },
  scrollViewContent: {
    paddingBottom: 10,
  },
  cardContainer: {
    marginBottom: 10,
  },
});

export default Column;
