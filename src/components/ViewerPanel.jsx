import React from "react";
import ReactMarkdown from "react-markdown";

/*
Props:
 - file: { id, name, url, content, type }
 - onEdit(content)
 - onFileDrop(fileList)
 - onOpenUrl(url)
*/
export default function ViewerPanel({ file, onEdit, onFileDrop, onOpenUrl }) {
  if (!file) {
    return (
      <div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:8,color:'var(--color-muted)'}}>
        <div style={{fontSize:18,fontWeight:600}}>No file selected</div>
        <div>Drag & drop a file here or click 'Open' from the Files list.</div>
        <div style={{marginTop:12}}>
          <input type="text" placeholder="Open remote URL (image / pdf / mp4)..." style={{padding:8,width:360}} onKeyDown={(e)=>{ if(e.key==='Enter') onOpenUrl && onOpenUrl(e.target.value); }} />
        </div>
      </div>
    );
  }

  const ext = (file.name || "").split(".").pop().toLowerCase();

  const renderTextEditor = () => (
    <textarea
      value={file.content || ""}
      onChange={(e)=> onEdit && onEdit(e.target.value)}
      style={{width:'100%',height:'100%',resize:'none',border:'none',background:'transparent',color:'var(--color-fg)',fontFamily:'monospace',padding:12}}
    />
  );

  switch (ext) {
    case "txt": case "js": case "json": case "css": case "html": case "xml":
      return renderTextEditor();

    case "md":
      return (
        <div style={{padding:12,overflow:'auto',height:'100%'}}>
          <ReactMarkdown>{file.content || ""}</ReactMarkdown>
        </div>
      );

    case "png": case "jpg": case "jpeg": case "gif": case "svg":
      return (
        <div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <img src={file.url} alt={file.name} style={{maxWidth:'100%',maxHeight:'100%'}} />
        </div>
      );

    case "mp3": case "wav":
      return (
        <div style={{padding:8}}>
          <audio controls style={{width:'100%'}}>
            <source src={file.url} />
            Your browser does not support audio playback.
          </audio>
        </div>
      );

    case "mp4": case "webm":
      return (
        <div style={{height:'100%'}}>
          <video controls style={{width:'100%',height:'100%'}}>
            <source src={file.url} />
            Your browser does not support video playback.
          </video>
        </div>
      );

    case "pdf":
      // iframe works for most pdfs
      return <iframe src={file.url} title={file.name} style={{width:'100%',height:'100%',border:'none'}} />;

    default:
      // fallback: if file.content exists, show text
      if (file.content) return renderTextEditor();
      return (
        <div style={{padding:12}}>
          <p>Preview not available for <strong>{file.name}</strong></p>
          <a href={file.url} download>Download file</a>
        </div>
      );
  }
}
