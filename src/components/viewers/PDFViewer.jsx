import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function PDFViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Document
        file={file.url || file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div>Loading PDF...</div>}
      >
        <Page pageNumber={pageNumber} />
      </Document>
      {numPages && (
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={() =>
              setPageNumber((prev) => Math.max(prev - 1, 1))
            }
          >
            Previous
          </button>
          <span style={{ margin: "0 10px" }}>
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, numPages))
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
