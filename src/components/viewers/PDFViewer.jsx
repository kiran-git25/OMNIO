import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Load PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PDFViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages));

  return (
    <div style={{ textAlign: "center" }}>
      <Document file={file.url || file} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>

      <div style={{ marginTop: "10px" }}>
        <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {pageNumber} of {numPages}
        </span>
        <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
          Next
        </button>
      </div>
    </div>
  );
}
