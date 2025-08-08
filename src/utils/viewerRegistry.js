import React from 'react';
import ReactPlayer from 'react-player';

const PDFViewer = ({ file }) => {
  const url = URL.createObjectURL(file);
  return <iframe src={url} title="PDF Viewer" width="100%" height="600px" />;
};

const ImageViewer = ({ file }) => {
  const url = URL.createObjectURL(file);
  return <img src={url} alt="Uploaded preview" className="max-w-full" />;
};

const VideoViewer = ({ file }) => {
  const url = URL.createObjectURL(file);
  return <video controls className="w-full"><source src={url} /></video>;
};

const AudioViewer = ({ file }) => {
  const url = URL.createObjectURL(file);
  return <audio controls className="w-full"><source src={url} /></audio>;
};

const DefaultViewer = ({ file }) => (
  <p>Unsupported file format: {file.type || file.name}</p>
);

export const getViewerComponent = (file) => {
  const type = file.type;
  if (type.includes('pdf')) return PDFViewer;
  if (type.includes('image')) return ImageViewer;
  if (type.includes('video')) return VideoViewer;
  if (type.includes('audio')) return AudioViewer;
  return DefaultViewer;
};
