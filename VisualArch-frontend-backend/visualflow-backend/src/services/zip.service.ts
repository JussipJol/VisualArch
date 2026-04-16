import JSZip from 'jszip';

interface ZipFile {
  path: string;
  content: string;
}

export const createProjectZip = async (files: ZipFile[]): Promise<Buffer> => {
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.path, file.content);
  }

  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return buffer;
};
