// MesoCycleScreen.js

import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TrelloBoardComponent from '../../components/Navigation/TrelloBoardComponent';
import DayCard from '../../components/Cards/DayCard';
import DotNavigation from '../../components/UI/DotNavigation';
import DayCardModal from '../../components/Modals/DayCardModal';
import helper from '../../helpers/helperTemplate';

const MesoCycleScreen = () => {
  const navigation = useNavigation();

  const [selectedMesocycleId] = useState('mesocycle_chest_focus');
  const [weeks, setWeeks] = useState([]);
  const [days, setDays] = useState([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const weeksData = helper.getWeeksForMesocycle(selectedMesocycleId);
    setWeeks(weeksData);

    const daysData = weeksData.flatMap(week =>
      week.days.map(dayId => {
        const day = helper.getDayById(dayId);
        return {...day, weekId: week.id};
      }),
    );
    setDays(daysData);
  }, [selectedMesocycleId]);

  useEffect(() => {
    const currentWeek = weeks[currentWeekIndex];
    if (currentWeek) {
      navigation.setOptions({
        title: `Meso Cycle - ${currentWeek.title}`,
      });
    }
  }, [currentWeekIndex, weeks, navigation]);

  const handleAddCard = useCallback(
    weekId => {
      const newDay = {
        id: `d${Date.now()}`,
        weekId,
        title: `Day ${days.filter(day => day.weekId === weekId).length + 1}`,
        content: 'New day description',
      };
      setDays(prevDays => [...prevDays, newDay]);
    },
    [days],
  );

  const handleRemoveCard = useCallback(cardId => {
    setDays(prevDays => prevDays.filter(day => day.id !== cardId));
  }, []);

  const handleOpenDayModal = useCallback(
    dayId => {
      const day = days.find(d => d.id === dayId);
      if (day) {
        setSelectedDay(day);
        setDayModalVisible(true);
      }
    },
    [days],
  );

  const handleCloseDayModal = useCallback(() => {
    setDayModalVisible(false);
    setSelectedDay(null);
  }, []);

  const handleSaveDay = useCallback(
    updatedDay => {
      setDays(prevDays =>
        prevDays.map(day =>
          day.id === selectedDay.id ? {...day, ...updatedDay} : day,
        ),
      );
      handleCloseDayModal();
    },
    [selectedDay, handleCloseDayModal],
  );

  const boardData = useMemo(
    () =>
      weeks.map(week => ({
        id: week.id,
        title: week.title,
        data: days.filter(day => day.weekId === week.id),
      })),
    [weeks, days],
  );

  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentWeekIndex(viewableItems[0].index);
    }
  }, []);

  const renderDayCard = useCallback(
    item => (
      <DayCard
        key={item.id}
        {...item}
        mesocycleId={selectedMesocycleId}
        onRemove={() => handleRemoveCard(item.id)}
        onModify={() => handleOpenDayModal(item.id)}
      />
    ),
    [selectedMesocycleId, handleRemoveCard, handleOpenDayModal],
  );

  return (
    <View style={styles.container}>
      <TrelloBoardComponent
        data={boardData}
        renderCard={renderDayCard}
        onViewableItemsChanged={onViewableItemsChanged}
        onAddCard={handleAddCard}
      />
      <View style={styles.navigation}>
        <DotNavigation currentIndex={currentWeekIndex} total={weeks.length} />
      </View>
      <DayCardModal
        visible={dayModalVisible}
        onClose={handleCloseDayModal}
        onSave={handleSaveDay}
        initialValues={
          selectedDay
            ? {title: selectedDay.title, content: selectedDay.content}
            : {title: '', content: ''}
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default MesoCycleScreen;
