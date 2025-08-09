import React, { useEffect, useState } from "react";
import { parsePresentation } from "pptx-parser";

export default function PPTXViewer({ fileUrl }) {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetch(fileUrl)
      .then(res => res.arrayBuffer())
      .then(buffer => parsePresentation(buffer))
      .then(presentation => {
        setSlides(presentation.slides);
      });
  }, [fileUrl]);

  return (
    <div>
      <h4>📊 PPTX Slides</h4>
      {slides.map((slide, idx) => (
        <div
          key={idx}
          style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}
        >
          {slide.texts.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
