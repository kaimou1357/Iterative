import React from 'react';
import { useSettings } from './SettingsContext';

const Settings = ({ isOpen, onClose }) => {
  const { 
    settings, setSettings, hasChanges, 
    initialSettings, updateUserSettings 
  } = useSettings();

  const handleModelNameChange = (event) => {
    const newModelName = event.target.value;
    const updatedSettings = {
      ...settings,
      model_name: newModelName,
    };
    
    setSettings(updatedSettings);
  };

  const handleColorSchemeChange = (event) => {
    const newColorScheme = event.target.value;
    const updatedSettings = {
      ...settings,
      color_scheme: newColorScheme,
    };

    setSettings(updatedSettings);
  };

  const handleCSSFrameworkChange = (event) => {
    const newCSSFramework = event.target.value;
    const updatedSettings = {
      ...settings,
      css_framework: newCSSFramework,
    };

    setSettings(updatedSettings);
  };

  const handleShowAssistantMessagesChange = (event) => {
    const newValue = event.target.checked;
    const updatedSettings = {
      ...settings,
      show_assistant_messages: newValue,
    };

    setSettings(updatedSettings);
  };

  const handleSaveClick = () => {
    updateUserSettings();
  };

  const handleCloseClick = () => {
    setSettings(initialSettings);
    onClose();
  };

  return (
    <div className={`modal fade ${isOpen ? 'show d-block' : 'd-none'}`} tabIndex="-1" aria-labelledby="userSettingsModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="userSettingsModalLabel">User Settings</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                </div>
                <div className="modal-body">
                    <div className="mb-3">
                        <label htmlFor="model-name" className="form-label">Model Name:</label>
                        <select
                            id="model-name"
                            className="form-select"
                            value={settings.model_name}
                            onChange={handleModelNameChange}
                        >
                            <option value="GPT_3_5_TURBO">gpt-3.5-turbo</option>
                            <option value="GPT_3_5_TURBO_16K">gpt-3.5-turbo-16k</option>
                            <option value="GPT_4">gpt-4</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="color-scheme" className="form-label">Color Scheme:</label>
                        <select
                            id="color-scheme"
                            className="form-select"
                            value={settings.color_scheme}
                            onChange={handleColorSchemeChange}
                        >
                            <option value="LIGHT">Light</option>
                            <option value="DARK">Dark</option>
                            <option value="SYSTEM">System</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="css-framework" className="form-label">CSS Framework:</label>
                        <select
                            id="css-framework"
                            className="form-select"
                            value={settings.css_framework}
                            onChange={handleCSSFrameworkChange}
                        >
                            <option value="BOOTSTRAP">Bootstrap 5</option>
                            <option value="DAISYUI">daisyUI</option>
                        </select>
                    </div>
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                        <label htmlFor="show-assistant-messages" className="form-label">Show Assistant Messages:</label>
                        <div className="form-check">
                            <input
                            type="checkbox"
                            id="show-assistant-messages"
                            className="form-check-input"
                            style={{ marginRight: '10px' }}
                            checked={settings.show_assistant_messages}
                            onChange={handleShowAssistantMessagesChange}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="user-email" className="form-label">User Email:</label>
                        <input
                            type="text"
                            id="user-email"
                            className="form-control"
                            value={settings.user_email}
                            readOnly
                        />
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseClick}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={handleSaveClick} disabled={!hasChanges}>Save Settings</button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Settings;

