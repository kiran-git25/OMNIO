import React from "react";

export default function PPTXViewer({ fileUrl }) {
  return (
    <iframe
      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
      style={{ width: "100%", height: "100%", border: "none" }}
      title="PPTX Viewer"
    />
  );
}
