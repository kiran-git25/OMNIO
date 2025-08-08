import React from 'react';
import PDFViewer from './viewers/PDFViewer';
import ImageViewer from './viewers/ImageViewer';
import VideoPlayer from './viewers/VideoPlayer';
import AudioPlayer from './viewers/AudioPlayer';
import TextViewer from './viewers/TextViewer';

export default function ViewerPanel({ file }) {
  const mime = file.type;

  if (mime.includes('pdf')) return <PDFViewer file={file} />;
  if (mime.startsWith('image')) return <ImageViewer file={file} />;
  if (mime.startsWith('video')) return <VideoPlayer file={file} />;
  if (mime.startsWith('audio')) return <AudioPlayer file={file} />;
  if (mime.startsWith('text') || mime.includes('json')) return <TextViewer file={file} />;

  return <p>Unsupported file format: {mime}</p>;
}
