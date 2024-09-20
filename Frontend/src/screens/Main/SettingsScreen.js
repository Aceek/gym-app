import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const settingsSections = [
  {
    title: 'Account',
    options: [
      {title: 'Edit profile', screen: 'EditProfileScreen', icon: 'user'},
      {title: 'Security', screen: 'SecurityScreen', icon: 'shield'},
      {title: 'Notifications', screen: 'NotificationsScreen', icon: 'bell'},
      {title: 'Privacy', screen: 'PrivacyScreen', icon: 'lock'},
    ],
  },
  {
    title: 'Support & About',
    options: [
      {
        title: 'My Subscription',
        screen: 'SubscriptionScreen',
        icon: 'credit-card',
      },
      {
        title: 'Help & Support',
        screen: 'HelpSupportScreen',
        icon: 'help-circle',
      },
      {
        title: 'Terms and Policies',
        screen: 'TermsPoliciesScreen',
        icon: 'file-text',
      },
    ],
  },
  {
    title: 'Cache & cellular',
    options: [
      {title: 'Free up space', screen: 'FreeUpSpaceScreen', icon: 'trash-2'},
      {title: 'Data Saver', screen: 'DataSaverScreen', icon: 'database'},
    ],
  },
];

const SettingsScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {settingsSections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionBox}>
            {section.options.map((option, optionIndex) => (
              <TouchableOpacity
                key={optionIndex}
                style={styles.settingItem}
                onPress={() => navigation.navigate(option.screen)}>
                <Icon
                  name={option.icon}
                  size={24}
                  color="#000"
                  style={styles.iconLeft}
                />
                <Text style={styles.settingText}>{option.title}</Text>
                <Icon
                  name="chevron-right"
                  size={24}
                  color="#000"
                  style={styles.iconRight}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.deleteAccountButton}>
        <Text style={styles.deleteAccountText}>Delete your Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
  iconLeft: {
    marginRight: 20,
  },
  iconRight: {
    marginLeft: 'auto',
  },
  deleteAccountButton: {
    alignItems: 'center',
    marginTop: 15,
  },
  deleteAccountText: {
    color: '#f00',
    fontSize: 16,
  },
});

export default SettingsScreen;
