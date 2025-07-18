/**
 * CONVERTO - Librerías de Conversión
 * Configuración centralizada para todas las librerías de conversión
 */

// Cargar ffmpeg.wasm dinámicamente
let FFmpeg = null;

async function loadFFmpeg() {
  if (FFmpeg) return FFmpeg;
  if (typeof window.FFmpeg !== 'undefined') {
    FFmpeg = window.FFmpeg;
    return FFmpeg;
  }
  throw new Error('FFmpeg no está disponible. Asegúrate de cargar js/ffmpeg/ffmpeg.min.js en tu HTML.');
}

// Configuración de ffmpeg.wasm
const FFMPEG_CONFIG = {
  log: false,
  corePath: 'js/ffmpeg/ffmpeg-core.js',
  mainName: 'main',
  mainPath: 'js/ffmpeg/ffmpeg-core.wasm'
};

// Configuración de jsPDF
const PDF_CONFIG = {
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
};

// Configuración de Canvas API
const CANVAS_CONFIG = {
  imageQuality: 0.95,
  maxWidth: 4096,
  maxHeight: 4096
};

/**
 * Clase para conversiones de imagen usando Canvas API
 */
class ImageConverter {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  /**
   * Convierte imagen a PNG
   */
  async convertToPNG(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          this.canvas.width = img.width;
          this.canvas.height = img.height;
          this.ctx.drawImage(img, 0, 0);
          
          this.canvas.toBlob((blob) => {
            if (blob && blob.size > 0) {
              resolve(blob);
            } else {
              reject(new Error('Error al generar el archivo PNG'));
            }
          }, 'image/png', CANVAS_CONFIG.imageQuality);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Convierte imagen a WebP
   */
  async convertToWebP(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          this.canvas.width = img.width;
          this.canvas.height = img.height;
          this.ctx.drawImage(img, 0, 0);
          
          this.canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/webp', CANVAS_CONFIG.imageQuality);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Convierte imagen a JPG
   */
  async convertToJPG(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          this.canvas.width = img.width;
          this.canvas.height = img.height;
          
          // Fondo blanco para JPG
          this.ctx.fillStyle = '#FFFFFF';
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          
          this.ctx.drawImage(img, 0, 0);
          
          this.canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', CANVAS_CONFIG.imageQuality);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}

/**
 * Clase para conversiones de audio/video usando ffmpeg.wasm
 */
class MediaConverter {
  constructor() {
    this.ffmpeg = null;
    this.isLoaded = false;
  }

  /**
   * Carga ffmpeg.wasm
   */
  async load() {
    if (this.isLoaded) return;
    
    try {
      await loadFFmpeg();
      const createFFmpeg = FFmpeg.createFFmpeg;
      const fetchFile = FFmpeg.fetchFile;
      this.ffmpeg = createFFmpeg(FFMPEG_CONFIG);
      await this.ffmpeg.load();
      this.isLoaded = true;
    } catch (error) {
      throw new Error('Error al cargar ffmpeg.wasm: ' + error.message);
    }
  }

  /**
   * Convierte WAV a MP3
   */
  async convertWavToMp3(file) {
    await this.load();
    
    const createFFmpeg = FFmpeg.createFFmpeg;
    const fetchFile = FFmpeg.fetchFile;
    
    // Escribir archivo de entrada
    this.ffmpeg.FS('writeFile', file.name, await fetchFile(file));
    
    // Ejecutar conversión
    await this.ffmpeg.run(
      '-i', file.name,
      '-codec:a', 'libmp3lame',
      '-q:a', '2',
      'output.mp3'
    );
    
    // Leer archivo de salida
    const data = this.ffmpeg.FS('readFile', 'output.mp3');
    
    // Limpiar memoria
    this.ffmpeg.FS('unlink', file.name);
    this.ffmpeg.FS('unlink', 'output.mp3');
    
    return new Blob([data.buffer], { type: 'audio/mp3' });
  }

  /**
   * Convierte MP3 a WAV
   */
  async convertMp3ToWav(file) {
    await this.load();
    
    const createFFmpeg = FFmpeg.createFFmpeg;
    const fetchFile = FFmpeg.fetchFile;
    
    // Escribir archivo de entrada
    this.ffmpeg.FS('writeFile', file.name, await fetchFile(file));
    
    // Ejecutar conversión
    await this.ffmpeg.run(
      '-i', file.name,
      '-acodec', 'pcm_s16le',
      '-ar', '44100',
      'output.wav'
    );
    
    // Leer archivo de salida
    const data = this.ffmpeg.FS('readFile', 'output.wav');
    
    // Limpiar memoria
    this.ffmpeg.FS('unlink', file.name);
    this.ffmpeg.FS('unlink', 'output.wav');
    
    return new Blob([data.buffer], { type: 'audio/wav' });
  }

  /**
   * Convierte MP4 a WebM
   */
  async convertMp4ToWebm(file) {
    await this.load();
    
    const createFFmpeg = FFmpeg.createFFmpeg;
    const fetchFile = FFmpeg.fetchFile;
    
    // Escribir archivo de entrada
    this.ffmpeg.FS('writeFile', file.name, await fetchFile(file));
    
    // Ejecutar conversión
    await this.ffmpeg.run(
      '-i', file.name,
      '-c:v', 'libvpx-vp9',
      '-crf', '30',
      '-b:v', '0',
      '-c:a', 'libopus',
      '-b:a', '128k',
      'output.webm'
    );
    
    // Leer archivo de salida
    const data = this.ffmpeg.FS('readFile', 'output.webm');
    
    // Limpiar memoria
    this.ffmpeg.FS('unlink', file.name);
    this.ffmpeg.FS('unlink', 'output.webm');
    
    return new Blob([data.buffer], { type: 'video/webm' });
  }

  /**
   * Convierte MP4 a GIF
   */
  async convertMp4ToGif(file) {
    await this.load();
    
    const createFFmpeg = FFmpeg.createFFmpeg;
    const fetchFile = FFmpeg.fetchFile;
    
    // Escribir archivo de entrada
    this.ffmpeg.FS('writeFile', file.name, await fetchFile(file));
    
    // Ejecutar conversión
    await this.ffmpeg.run(
      '-i', file.name,
      '-vf', 'fps=10,scale=480:-1:flags=lanczos',
      '-f', 'gif',
      'output.gif'
    );
    
    // Leer archivo de salida
    const data = this.ffmpeg.FS('readFile', 'output.gif');
    
    // Limpiar memoria
    this.ffmpeg.FS('unlink', file.name);
    this.ffmpeg.FS('unlink', 'output.gif');
    
    return new Blob([data.buffer], { type: 'image/gif' });
  }
}

/**
 * Conversión genérica de audio usando ffmpeg.wasm
 * @param {File} file - Archivo de entrada
 * @param {string} outputFormat - Formato de salida (ej: 'mp3', 'wav', 'ogg', 'flac', etc.)
 * @returns {Promise<Blob>} - Blob del archivo convertido
 */
async function convertAudioGeneric(file, outputFormat) {
  await loadFFmpeg();
  if (typeof FFmpeg === 'undefined' || !FFmpeg) {
    throw new Error('FFmpeg no está cargado. Verifica tu conexión a internet.');
  }
  const createFFmpeg = FFmpeg.createFFmpeg;
  const fetchFile = FFmpeg.fetchFile;
  const ffmpeg = createFFmpeg({
    log: false,
    corePath: 'js/ffmpeg/ffmpeg-core.js'
  });
  await ffmpeg.load();
  // Escribir archivo de entrada
  ffmpeg.FS('writeFile', file.name, await fetchFile(file));
  // Definir nombre de salida
  const outputName = 'output.' + outputFormat;
  // Ejecutar conversión
  await ffmpeg.run('-i', file.name, outputName);
  // Leer archivo de salida
  const data = ffmpeg.FS('readFile', outputName);
  // Limpiar memoria
  ffmpeg.FS('unlink', file.name);
  ffmpeg.FS('unlink', outputName);
  // Crear blob
  let mime = 'audio/' + outputFormat;
  if (outputFormat === 'mp3') mime = 'audio/mpeg';
  if (outputFormat === 'wav') mime = 'audio/wav';
  if (outputFormat === 'ogg') mime = 'audio/ogg';
  if (outputFormat === 'flac') mime = 'audio/flac';
  return new Blob([data.buffer], { type: mime });
}

/**
 * Conversión genérica de video usando ffmpeg.wasm
 * @param {File} file - Archivo de entrada
 * @param {string} outputFormat - Formato de salida (ej: 'mp4', 'avi', 'webm')
 * @returns {Promise<Blob>} - Blob del archivo convertido
 */
async function convertVideoGeneric(file, outputFormat) {
  await loadFFmpeg();
  if (typeof FFmpeg === 'undefined' || !FFmpeg) {
    throw new Error('FFmpeg no está cargado. Verifica tu conexión a internet.');
  }
  const createFFmpeg = FFmpeg.createFFmpeg;
  const fetchFile = FFmpeg.fetchFile;
  const ffmpeg = createFFmpeg({
    log: false,
    corePath: 'js/ffmpeg/ffmpeg-core.js'
  });
  await ffmpeg.load();
  // Escribir archivo de entrada
  ffmpeg.FS('writeFile', file.name, await fetchFile(file));
  // Definir nombre de salida
  const outputName = 'output.' + outputFormat;
  // Elegir parámetros según formato
  let args = ['-i', file.name];
  if (outputFormat === 'mp4') {
    args.push('-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-c:a', 'aac', '-b:a', '128k', outputName);
  } else if (outputFormat === 'avi') {
    args.push('-c:v', 'mpeg4', '-qscale:v', '3', '-c:a', 'mp3', outputName);
  } else if (outputFormat === 'webm') {
    args.push('-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-c:a', 'libopus', '-b:a', '128k', outputName);
  } else {
    args.push(outputName); // fallback genérico
  }
  // Ejecutar conversión
  await ffmpeg.run(...args);
  // Leer archivo de salida
  const data = ffmpeg.FS('readFile', outputName);
  // Limpiar memoria
  ffmpeg.FS('unlink', file.name);
  ffmpeg.FS('unlink', outputName);
  // Crear blob
  let mime = 'video/' + outputFormat;
  if (outputFormat === 'mp4') mime = 'video/mp4';
  if (outputFormat === 'avi') mime = 'video/x-msvideo';
  if (outputFormat === 'webm') mime = 'video/webm';
  return new Blob([data.buffer], { type: mime });
}

/**
 * Clase para conversiones a PDF usando jsPDF
 */
class PDFConverter {
  constructor() {
    this.pdf = null;
  }

  /**
   * Convierte imagen a PDF
   */
  async convertImageToPDF(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          const { jsPDF } = window.jspdf;
          this.pdf = new jsPDF(PDF_CONFIG);
          
          // Crear canvas temporal
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Obtener datos de imagen
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          
          // Calcular dimensiones para PDF
          const imgWidth = 210; // A4 width in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          // Agregar imagen al PDF
          this.pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
          
          // Generar PDF
          const pdfBlob = this.pdf.output('blob');
          resolve(pdfBlob);
          
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}

// Exportar clases para uso global
window.ImageConverter = ImageConverter;
window.MediaConverter = MediaConverter;
window.PDFConverter = PDFConverter;
window.convertVideoGeneric = convertVideoGeneric; 