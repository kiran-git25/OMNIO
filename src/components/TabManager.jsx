import React, { useState } from 'react';
import TileWorkspace from './TileWorkspace';
import CommunicationHub from './CommunicationHub';

const TabManager = () => {
  const [activeTab, setActiveTab] = useState('files');

  const renderTab = () => {
    switch (activeTab) {
      case 'files':
        return <TileWorkspace />;
      case 'communication':
        return <CommunicationHub />;
      default:
        return null;
    }
  };

  return (
    <div className="tab-manager">
      <div className="tab-header">
        <button
          className={activeTab === 'files' ? 'active' : ''}
          onClick={() => setActiveTab('files')}
        >
          Files
        </button>
        <button
          className={activeTab === 'communication' ? 'active' : ''}
          onClick={() => setActiveTab('communication')}
        >
          Communication
        </button>
      </div>
      <div className="tab-content">{renderTab()}</div>
    </div>
  );
};

export default TabManager;
