// MesoCycleScreen.js

import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TrelloBoardComponent from '../../components/Navigation/TrelloBoardComponent';
import DayCard from '../../components/Cards/DayCard';
import DotNavigation from '../../components/UI/DotNavigation';
import DayCardModal from '../../components/Modals/DayCardModal';
import * as helper from '../../helpers/helperTemplate';
import * as helperUpdate from '../../helpers/helperTemplateUpdate';

const MesoCycleScreen = () => {
  const navigation = useNavigation();

  const [selectedMesocycleId] = useState('mesocycle_chest_focus');
  const [weeks, setWeeks] = useState([]);
  const [days, setDays] = useState([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    loadData();
  }, [selectedMesocycleId, loadData]);

  const loadData = useCallback(async () => {
    try {
      const weeksData = await helper.getWeeksForMesocycle(selectedMesocycleId);
      setWeeks(weeksData);

      const daysDataPromises = weeksData.flatMap(week =>
        week.days.map(async dayId => {
          const day = await helper.getDayById(dayId);
          return {...day, weekId: week.id};
        }),
      );

      const daysData = await Promise.all(daysDataPromises);
      setDays(daysData);
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
    }
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
    async weekId => {
      try {
        const dayId = `day_${Date.now()}`;
        const newDay = {
          id: dayId,
          title: `Day ${days.filter(day => day.weekId === weekId).length + 1}`,
          content: 'New day description',
          exercises: [],
        };
        // Ajouter le nouveau jour
        await helperUpdate.addDay(dayId, newDay);
        // Associer le jour à la semaine
        await helperUpdate.addDayToWeek(weekId, dayId);
        // Recharger les données
        await loadData();
      } catch (error) {
        console.error("Erreur lors de l'ajout du jour :", error);
      }
    },
    [days, loadData],
  );

  const handleRemoveCard = useCallback(
    async cardId => {
      try {
        // Supprimer le jour
        await helperUpdate.removeDay(cardId);
        // Recharger les données
        await loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression du jour :', error);
      }
    },
    [loadData],
  );

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
    async updatedDay => {
      try {
        const dayId = selectedDay.id;
        const dayData = {
          ...(await helper.getDayById(dayId)),
          ...updatedDay,
        };
        // Mettre à jour le jour
        await helperUpdate.updateDay(dayId, dayData);
        // Recharger les données
        await loadData();
        handleCloseDayModal();
      } catch (error) {
        console.error('Erreur lors de la mise à jour du jour :', error);
      }
    },
    [selectedDay, loadData, handleCloseDayModal],
  );

  const boardData = useMemo(() => {
    return weeks.map(week => ({
      id: week.id,
      title: week.title,
      data: days.filter(day => day.weekId === week.id),
    }));
  }, [weeks, days]);

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
