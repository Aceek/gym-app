import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import MesoCycleList from '../../components/mesoCycle/MesoCycleList';
import CreateMesoCycleForm from '../../components/Forms/CreateMesoCycleForm';

const MesoCycleScreen = ({navigation}) => {
  const [mesocycles, setMesocycles] = useState([]);

  useEffect(() => {
    // Simuler une récupération d'API ou depuis Redux
    const fetchMesocycles = async () => {
      // Remplacer par un appel d'API ou une récupération Redux
      const data = []; // À remplacer par de vraies données
      setMesocycles(data);
    };

    fetchMesocycles();
  }, []);

  return (
    <View>
      {mesocycles.length > 0 ? (
        <MesoCycleList mesocycles={mesocycles} navigation={navigation} />
      ) : (
        <CreateMesoCycleForm setMesocycles={setMesocycles} />
      )}
    </View>
  );
};

export default MesoCycleScreen;
