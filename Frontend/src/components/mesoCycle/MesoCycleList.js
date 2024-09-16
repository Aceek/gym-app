import React from 'react';
import {View, FlatList} from 'react-native';
import MesoCycleCard from './MesoCycleCard';

const MesoCycleList = ({mesocycles, navigation}) => {
  return (
    <View>
      <FlatList
        data={mesocycles}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <MesoCycleCard mesocycle={item} navigation={navigation} />
        )}
      />
    </View>
  );
};

export default MesoCycleList;
