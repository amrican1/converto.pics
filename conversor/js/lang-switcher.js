// js/lang-switcher.js
const translations = {
  es: {
    brand: "CONVERTO",
    heroTitle: "Conversor Universal",
    heroSubtitle: "Convierte imágenes, audio, video y más archivos online gratis",
    converterTitle: "Convertir Archivos",
    converterDesc: "Sube tu archivo y elige el formato de salida",
    uploadText: "Arrastra archivos aquí o haz clic para seleccionar",
    uploadHint: "Soporta múltiples archivos",
    formatLabel: "Formato de salida:",
    convertBtn: "Convertir Archivos",
    formatsTitle: "Formatos Soportados",
    catImages: "Imágenes",
    catAudio: "Audio",
    catVideo: "Video",
    toolsTitle: "Herramientas Especializadas",
    footerUniversal: "Conversor Universal",
    footerAudio: "Conversor de Audio",
    footerPrivacy: "Privacidad",
    footerTerms: "Términos",
    footerContact: "Contacto",
    footerCopy: "&copy; 2024 Converto. Todo en tu navegador."
  },
  en: {
    brand: "CONVERTO",
    heroTitle: "Universal Converter",
    heroSubtitle: "Convert images, audio, video and more files online for free",
    converterTitle: "Convert Files",
    converterDesc: "Upload your file and choose the output format",
    uploadText: "Drag files here or click to select",
    uploadHint: "Supports multiple files",
    formatLabel: "Output format:",
    convertBtn: "Convert Files",
    formatsTitle: "Supported Formats",
    catImages: "Images",
    catAudio: "Audio",
    catVideo: "Video",
    toolsTitle: "Specialized Tools",
    footerUniversal: "Universal Converter",
    footerAudio: "Audio Converter",
    footerPrivacy: "Privacy",
    footerTerms: "Terms",
    footerContact: "Contact",
    footerCopy: "&copy; 2024 Converto. All in your browser."
  },
  pt: {
    brand: "CONVERTO",
    heroTitle: "Conversor Universal",
    heroSubtitle: "Converta imagens, áudio, vídeo e mais arquivos online grátis",
    converterTitle: "Converter Arquivos",
    converterDesc: "Envie seu arquivo e escolha o formato de saída",
    uploadText: "Arraste arquivos aqui ou clique para selecionar",
    uploadHint: "Suporta múltiplos arquivos",
    formatLabel: "Formato de saída:",
    convertBtn: "Converter Arquivos",
    formatsTitle: "Formatos Suportados",
    catImages: "Imagens",
    catAudio: "Áudio",
    catVideo: "Vídeo",
    toolsTitle: "Ferramentas Especializadas",
    footerUniversal: "Conversor Universal",
    footerAudio: "Conversor de Áudio",
    footerPrivacy: "Privacidade",
    footerTerms: "Termos",
    footerContact: "Contato",
    footerCopy: "&copy; 2024 Converto. Tudo no seu navegador."
  }
};
function setLang(lang) {
  const t = translations[lang] || translations.es;
  const ids = Object.keys(t);
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (id === 'footerCopy') {
        el.innerHTML = t[id];
      } else {
        el.textContent = t[id];
      }
    }
  });
  const langSelect = document.getElementById('langSelect');
  if (langSelect) langSelect.value = lang;
}
document.addEventListener('DOMContentLoaded', function() {
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.addEventListener('change', function() {
      setLang(this.value);
    });
    setLang(langSelect.value || 'es');
  }
}); 