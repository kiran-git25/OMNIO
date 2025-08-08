
import React from 'react';
import PDFViewer from './viewers/PDFViewer';
import ImageViewer from './viewers/ImageViewer';
import VideoPlayer from './viewers/VideoPlayer';
import AudioPlayer from './viewers/AudioPlayer';
import TextViewer from './viewers/TextViewer';
import DocxViewer from './viewers/DocxViewer';
import ExcelViewer from './viewers/ExcelViewer';
import ArchiveViewer from './viewers/ArchiveViewer';
import MarkdownViewer from './viewers/MarkdownViewer';
import CodeViewer from './viewers/CodeViewer';

export default function ViewerPanel({ file }) {
  const isRemote = file.type === 'url/remote';
  const url = isRemote ? file.url : URL.createObjectURL(file);
  const mime = isRemote ? '' : file.type;

if (url.match(/\\.docx$/i)) return <DocxViewer file={file} />;
if (url.match(/\\.xlsx$/i)) return <ExcelViewer file={file} />;
if (url.match(/\\.zip|\\.7z$/i)) return <ArchiveViewer file={file} />;
if (url.match(/\\.md$/i)) return <MarkdownViewer file={file} url={url} />;
if (url.match(/\\.js|\\.py|\\.json|\\.jsx|\\.html$/i)) return <CodeViewer file={file} url={url} />;
  
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
