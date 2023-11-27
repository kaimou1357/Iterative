import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';
import { useAuth } from './AuthContext';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [settings, setSettings] = useState({
    user_email: "",
    model_name: "",
    color_scheme: "",
    show_assistant_messages: false,
    css_framework: ""
  });

  const [initialSettings, setInitialSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
        getUserSettings();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const checkForChanges = (updatedSettings) => {
        for (let key in updatedSettings) {
            console.log('key:', key);
            console.log('updatedSettings[key]:', updatedSettings[key]);
            console.log('initialSettings[key]:', initialSettings[key]);
            
            if (updatedSettings[key] !== initialSettings[key]) {
                return true;
            }
        }
        return false;
    };
    setHasChanges(checkForChanges(settings));
  }, [settings, initialSettings]);

  const getUserSettings = () => {
    axios.get(`${API_BASE_URL}/get-user-settings`)
      .then(response => {
        setSettings(response.data.settings);
        setInitialSettings(response.data.settings);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error getting user settings:", error);
        setLoading(false);
      });
  };

  const updateUserSettings = () => {
    axios.post(`${API_BASE_URL}/update-user-settings`, { settings })
      .then(response => {
        if (response.data.success) {
          alert("Settings updated successfully!");
          setInitialSettings(settings);
          setHasChanges(false);
        } else {
          alert("Error updating user settings.");
        }
      })
      .catch(error => {
        console.error("Error updating user settings:", error);
        alert("An error occurred while updating settings.");
      });
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, setSettings, loading, hasChanges, 
      initialSettings, updateUserSettings 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
