import * as docx from "docx-preview";

export default function DocxViewer({ fileUrl }) {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    fetch(fileUrl)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const dp = new docx.DocxPreview();
        dp.renderAsync(buffer, containerRef.current);
      });
  }, [fileUrl]);

  return (
    <div ref={containerRef} style={{ background: "#fff", padding: "1rem" }}>
      <p>Loading DOCX...</p>
    </div>
  );
}
