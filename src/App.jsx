import React, { useState, useEffect, useMemo, useCallback } from "react";
import Topbar from "./components/Topbar";
import TabManager from "./components/TabManager";
import ViewerPanel from "./components/ViewerPanel";
import ChatBox from "./components/ChatBox";
import URLPlayer from "./components/URLPlayer";
import Split from "react-split";
import "./index.css";

/*
 App responsibilities:
 - Manage tabs & files
 - Handle drag-drop files (create object URLs & read text)
 - Provide URL player tab
 - Provide simple in-memory "rooms" for chat (group/1:1)
*/

export default function App() {
  // files: { id, name, url (objectURL or external), content (text if applicable), type }
  const [files, setFiles] = useState(() => []);
  const [tabs, setTabs] = useState(() => [
    // initial example tabs (could be files or special tabs)
    // special "url-player" tab id is 'tab:url'
    { id: "tab:files", name: "Files", kind: "panel" },
    { id: "tab:editor", name: "Editor", kind: "panel" },
    { id: "tab:player", name: "Play URL", kind: "urlplayer" }
  ]);
  const [activeTabId, setActiveTabId] = useState("tab:editor");
  const [activeFileId, setActiveFileId] = useState(null);

  // theme default dark
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("omnio_theme") || "dark";
    } catch (e) { return "dark"; }
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("omnio_theme", theme); } catch (e) {}
  }, [theme]);

  // Chat rooms (simple local model). Each room: { id, name, members:[], messages:[], streamUrl }
  const [rooms, setRooms] = useState(() => {
    const demo = [{
      id: "r_general",
      name: "General",
      members: ["Alice","Bob","You"],
      messages: [
        { id: "m1", from: "Alice", text: "Welcome to Omnio chat!" }
      ],
      streamUrl: ""
    }];
    return demo;
  });
  const [activeRoomId, setActiveRoomId] = useState(rooms[0]?.id);

  // helper: find active file & room
  const activeFile = useMemo(() => files.find(f => f.id === activeFileId) || null, [files, activeFileId]);
  const activeRoom = useMemo(() => rooms.find(r => r.id === activeRoomId) || rooms[0] || null, [rooms, activeRoomId]);

  // file helpers
  const addFileObjects = useCallback((fileList) => {
    // fileList is FileList or array of File
    const arr = Array.from(fileList);
    arr.forEach(file => {
      const id = Date.now().toString() + "-" + Math.random().toString(36).slice(2,6);
      const url = URL.createObjectURL(file);
      const name = file.name;
      const type = file.type || "";
      // read text content for text-based files
      if (type.startsWith("text") || /\.(md|json|js|css|html|xml|txt)$/i.test(name)) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setFiles(prev => [...prev, { id, name, url, content: ev.target.result, type }]);
          setActiveFileId(id);
        };
        reader.readAsText(file);
      } else {
        setFiles(prev => [...prev, { id, name, url, content: null, type }]);
        setActiveFileId(id);
      }
    });
  }, []);

  // open external URL as "file" (for remote images / pdf / direct media)
  const openUrlAsFile = useCallback((url, name) => {
    const id = Date.now().toString() + "-" + Math.random().toString(36).slice(2,6);
    const inferredName = name || url.split("/").pop().split("?")[0] || url;
    setFiles(prev => [...prev, { id, name: inferredName, url, content: null, type: "" }]);
    setActiveFileId(id);
    setActiveTabId("tab:editor");
  }, []);

  // close file: revoke objectURL if created locally
  const closeFile = (id) => {
    const f = files.find(x => x.id === id);
    if (!f) return;
    // revoke only if object URL (starts with blob:)
    if (f.url && f.url.startsWith("blob:")) {
      try { URL.revokeObjectURL(f.url); } catch(e){}
    }
    setFiles(prev => prev.filter(x => x.id !== id));
    if (activeFileId === id) setActiveFileId(null);
  };

  // drop handlers bound to center panel (Viewer)
  const onDropFiles = (fileList) => {
    addFileObjects(fileList);
    setActiveTabId("tab:editor");
  };

  // simple tab actions
  const addNewTab = (name = "untitled") => {
    const id = "tab:" + Date.now().toString(36).slice(2,8);
    const newTab = { id, name, kind: "panel" };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(id);
  };
  const closeTab = (id) => setTabs(prev => prev.filter(t => t.id !== id));
  // reorderTabs can be provided later

  // chat helpers
  const sendMessageToRoom = (roomId, message) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, messages: [...r.messages, message] } : r));
  };
  const shareStreamToRoom = (roomId, streamUrl) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, streamUrl } : r));
  };

  // cleanup objectURLs on unmount
  useEffect(() => {
    return () => {
      files.forEach(f => { if (f.url && f.url.startsWith("blob:")) try{ URL.revokeObjectURL(f.url) }catch{} });
    };
  }, [files]);

  return (
    <div className="app-root">
      <Topbar theme={theme} toggleTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} onNewTab={() => addNewTab()} />
      <TabManager
        tabs={tabs}
        activeId={activeTabId}
        setActiveId={setActiveTabId}
        onClose={(id) => closeTab(id)}
        onAdd={() => addNewTab()}
      />
      <div className="main-split">
        <Split sizes={[20, 60, 20]} minSize={[140, 300, 200]} gutterSize={8} className="split" >
          {/* Left panel: file list / explorer */}
          <div className="panel left-panel">
            <div style={{padding:8}}>
              <h4 style={{marginTop:0}}>Files</h4>
              <div style={{display:'flex', flexDirection:'column', gap:6}}>
                <label style={{display:'block'}}>
                  <input type="file" multiple style={{display:'none'}} onChange={(e)=>onDropFiles(e.target.files)} />
                </label>
                {files.length===0 && <div style={{color:'var(--color-muted)'}}>Drop files into center panel or use input above</div>}
                {files.map(f => (
                  <div key={f.id} className={`file-item ${activeFileId===f.id ? 'file-active':''}`} onClick={() => { setActiveFileId(f.id); setActiveTabId("tab:editor"); }}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div style={{overflow:'hidden', textOverflow:'ellipsis'}}>{f.name}</div>
                      <div style={{display:'flex',gap:6}}>
                        <button className="btn tiny" onClick={(e)=>{ e.stopPropagation(); openUrlAsFile(f.url,f.name); }}>Open</button>
                        <button className="btn tiny" onClick={(e)=>{ e.stopPropagation(); closeFile(f.id); }}>✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center panel: viewer / editor / URL player */}
          <div className="panel center-panel" onDragOver={(e)=>{ e.preventDefault(); e.dataTransfer.dropEffect='copy'; }} onDrop={(e)=>{ e.preventDefault(); if (e.dataTransfer.files && e.dataTransfer.files.length) onDropFiles(e.dataTransfer.files); }}>
            {/* if active tab is urlplayer, show URLPlayer, else show Viewer */}
            { activeTabId === "tab:player" ? (
              <URLPlayer onOpenUrl={(url)=>openUrlAsFile(url,url)} onShareToRoom={(url)=>shareStreamToRoom(activeRoomId,url)} />
            ) : (
              <ViewerPanel
                file={activeFile}
                onEdit={(content)=> {
                  // update file content if text
                  setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content } : f));
                }}
                onFileDrop={(fileList)=>onDropFiles(fileList)}
                onOpenUrl={(url, name)=>openUrlAsFile(url,name)}
              />
            )}
          </div>

          {/* Right panel: chat */}
          <div className="panel right-panel">
            <ChatBox
              rooms={rooms}
              activeRoomId={activeRoomId}
              setActiveRoomId={setActiveRoomId}
              onSendMessage={(roomId, msg) => sendMessageToRoom(roomId,msg)}
              onShareStream={(roomId, url) => shareStreamToRoom(roomId, url)}
              onOpenFile={(fileId)=>{ setActiveFileId(fileId); setActiveTabId("tab:editor"); }}
            />
          </div>
        </Split>
      </div>
    </div>
  );
}
