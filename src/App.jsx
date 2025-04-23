import React, { useState } from 'react';
import Editor from './Editor'; // Updated import if you've renamed the component
import './App.css'; // Still using the same CSS file, can rename if needed

const App= () => {
  const [isEditorVisible, setEditorVisibility] = useState(false);

  const startNewNote = () => {
    setEditorVisibility(true);
  };

  const handleAllNotesCleared = () => {
    setEditorVisibility(false);
  };

  return (
    <div className="notebook-container">
      {!isEditorVisible ? (
        <div className="empty-screen">
          <h1>No notes available</h1>
          <button className="start-button" onClick={startNewNote}>
            Start Writing
          </button>
        </div>
      ) : (
        <Editor onNotesCleared={handleAllNotesCleared} />
      )}
    </div>
  );
};

export default App;
