
import React from 'react';
import PDFViewer from './viewers/PDFViewer';
import ImageViewer from './viewers/ImageViewer';
import VideoPlayer from './viewers/VideoPlayer';
import AudioPlayer from './viewers/AudioPlayer';
import TextViewer from './viewers/TextViewer';

export default function ViewerPanel({ file }) {
  const isRemote = file.type === 'url/remote';
  const url = isRemote ? file.url : URL.createObjectURL(file);
  const mime = isRemote ? '' : file.type;

  if (mime.includes('pdf') || (isRemote && url.endsWith('.pdf')))
    return <PDFViewer url={url} />;
  if (mime.startsWith('image') || (isRemote && /\.(png|jpe?g|gif)$/i.test(url)))
    return <ImageViewer url={url} />;
  if (mime.startsWith('video') || (isRemote && /\.(mp4|webm|mkv)$/i.test(url)))
    return <VideoPlayer url={url} />;
  if (mime.startsWith('audio') || (isRemote && /\.(mp3|wav|ogg)$/i.test(url)))
    return <AudioPlayer url={url} />;
  if (mime.startsWith('text') || mime.includes('json') || isRemote)
    return <TextViewer file={file} url={url} />;

  return <p>Unsupported file type: {mime}</p>;
}
