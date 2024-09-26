import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TrelloBoardComponent from '../../components/Navigation/TrelloBoardComponent';
import DayCard from '../../components/Cards/DayCard';
import DotNavigation from '../../components/UI/DotNavigation';
import DayCardModal from '../../components/Modals/DayCardModal';
import helper from '../../helpers/helperTemplate';

const MesoCycleScreen = React.memo(() => {
  const navigation = useNavigation();

  const [selectedMesocycleId, setSelectedMesocycleId] = useState(
    'mesocycle_chest_focus',
  );

  const [weeks, setWeeks] = useState([]);
  const [days, setDays] = useState([]);

  useEffect(() => {
    // Récupérer les semaines du mésocycle sélectionné
    const weeksData = helper.getWeeksForMesocycle(selectedMesocycleId);
    setWeeks(weeksData);

    // Récupérer les jours pour chaque semaine et ajouter la propriété weekId
    const daysData = [];
    weeksData.forEach(week => {
      const weekDays = week.days.map(dayId => {
        const day = helper.getDayById(dayId);
        return {...day, weekId: week.id};
      });
      daysData.push(...weekDays);
    });
    setDays(daysData);
  }, [selectedMesocycleId]);

  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  const updateHeaderTitle = useCallback(
    index => {
      const currentWeek = weeks[index];
      if (currentWeek) {
        navigation.setOptions({
          title: `Meso Cycle - ${currentWeek.title}`,
        });
      }
    },
    [weeks, navigation],
  );

  useEffect(() => {
    updateHeaderTitle(currentWeekIndex);
  }, [currentWeekIndex, updateHeaderTitle]);

  const handleAddCard = useCallback(
    weekId => {
      const newCard = {
        id: `d${Date.now()}`,
        weekId: weekId,
        title: `Day ${days.filter(day => day.weekId === weekId).length + 1}`,
        content: 'New day description',
      };
      setDays(prevDays => [...prevDays, newCard]);
    },
    [days],
  );

  const handleRemoveCard = useCallback((weekId, cardId) => {
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

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentWeekIndex(newIndex);
      updateHeaderTitle(newIndex);
    }
  }).current;

  const renderDayCard = useCallback(
    (item, weekId) => (
      <DayCard
        key={item.id}
        {...item}
        weekId={weekId}
        mesocycleId={selectedMesocycleId}
        onRemove={() => handleRemoveCard(weekId, item.id)}
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
        viewabilityConfig={{itemVisiblePercentThreshold: 50}}
        onAddCard={handleAddCard}
        onRemoveCard={handleRemoveCard}
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
            ? {
                title: selectedDay.title,
                content: selectedDay.content,
              }
            : {title: '', content: ''}
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default MesoCycleScreen;
