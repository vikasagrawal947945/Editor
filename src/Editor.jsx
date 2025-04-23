import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import "./Editor.css";
import remarkGfm from "remark-gfm";
import {
  FaBold, FaItalic,FaQuoteRight,FaLink, FaImage, FaCode,FaListUl,FaListOl,FaTrash,FaPlus,FaHeading,
  FaStrikethrough,
} from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";


const Editor = ({ onNotesCleared }) => {
  const [noteTitle, setNoteTitle] = useState("");
  const [editorContent, setEditorContent] = useState("# Start writing your note...");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [savedNotes, setSavedNotes] = useState([]);
  const editorRef = useRef(null);

  const applyFormatting = (prefix, suffix = "", isMultiLine = false) => {
    const textArea = editorRef.current;
    if (!textArea) return;

    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selection = editorContent.slice(start, end);

    let formattedText;
    if (isMultiLine) {
      const lines = selection.split("\n");
      const transformed = lines.map((line) => prefix + line).join("\n");
      formattedText =
        editorContent.slice(0, start) + transformed + editorContent.slice(end);

      setEditorContent(formattedText);
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(start, start + transformed.length);
      }, 0);
    } else {
      formattedText =
        editorContent.slice(0, start) +
        prefix +
        selection +
        suffix +
        editorContent.slice(end);

      setEditorContent(formattedText);
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + selection.length
        );
      }, 0);
    }
  };

  const storeNote = () => {
    if (noteTitle.trim() || editorContent.trim()) {
      setSavedNotes((prevNotes) => [
        ...prevNotes,
        { noteTitle, content: editorContent },
      ]);
      setNoteTitle("");
      setEditorContent("# Start writing your note...");
      setIsPreviewing(false);
    }
  };

  const removeNote = (idx) => {
    const updatedNotes = savedNotes.filter((_, index) => index !== idx);
    setSavedNotes(updatedNotes);
    if (updatedNotes.length === 0) {
      onNotesCleared();
    }
  };

  const loadNote = (note) => {
    setNoteTitle(note.noteTitle);
    setEditorContent(note.content);
    setIsPreviewing(false);
  };

  return (
    <div className="editor-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="header-name-btn">
            <h1>MyNotes</h1>
            <button onClick={storeNote}>
              <FaPlus className="icon-button" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Note title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="title-input"
          />
        </div>

        <div className="notes-list">
          {savedNotes.map((note, i) => (
            <div key={i} className="note-item">
              <div onClick={() => loadNote(note)}>
                {note.noteTitle || "Untitled"}
              </div>
              <button onClick={() => removeNote(i)} className="delete-button">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="title-input-section">
          <button
            onClick={() => {
              setNoteTitle("");
              setEditorContent("# Start writing your note...");
            }}
            className="clear-note-button"
          >
            <FaTrash /> Reset Note
          </button>
        </div>
      </aside>

      {/* Editor & Preview Section */}
      <main className="editor-panel">
        <div className="toolbar">
          <button
            onClick={() => setIsPreviewing(false)}
            className={`toggle-tab ${!isPreviewing ? "active" : ""}`}
          >
            Edit
          </button>
          <button
            onClick={() => setIsPreviewing(true)}
            className={`toggle-tab ${isPreviewing ? "active" : ""}`}
          >
            Preview
          </button>

          {!isPreviewing && (
            <div className="toolbar-icons">
              <div className="toolbar-grp">
                <FaHeading onClick={() => applyFormatting("### ")} />
                <FaBold onClick={() => applyFormatting("**", "**")} />
                <FaItalic onClick={() => applyFormatting("*", "*")} />
                <FaStrikethrough onClick={() => applyFormatting("~~", "~~")} />
              </div>
              <div className="toolbar-grp">
                <FaQuoteRight onClick={() => applyFormatting("> ")} />
                <FaLink onClick={() => applyFormatting("[", "](url)")} />
                <FaImage onClick={() => applyFormatting("![alt](", ")")} />
                <FaCode onClick={() => applyFormatting("`", "`")} />
              </div>
              <div className="toolbar-grp">
                <FaListUl onClick={() => applyFormatting("- ", "", true)} />
                <FaListOl onClick={() => applyFormatting("1. ", "", true)} />
                <FaListCheck
                  onClick={() => applyFormatting("- [ ] ", "", true)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="editor-body">
          <textarea
            ref={editorRef}
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            className={`editor-textarea ${isPreviewing ? "hidden" : ""}`}
          />
          <div
            className={`editor-preview ${isPreviewing ? "visible" : "hidden"}`}
          >
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {editorContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
