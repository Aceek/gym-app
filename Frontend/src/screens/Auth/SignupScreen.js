import React, {useState, useContext} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../context/AuthContext';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const {register} = useContext(AuthContext);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await register(email, password, displayName);
      Alert.alert(
        'Inscription réussie',
        'Veuillez vérifier votre email pour confirmer votre compte.',
        [{text: 'OK', onPress: () => navigation.navigate('SignIn')}],
      );
    } catch (err) {
      setError("Échec de l'inscription, veuillez réessayer");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom d'affichage</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Entrez votre nom d'affichage"
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Entrez votre email"
      />
      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Entrez votre mot de passe"
      />
      <Text style={styles.label}>Confirmez le mot de passe</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Confirmez votre mot de passe"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="S'inscrire" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});

export default SignUp;
