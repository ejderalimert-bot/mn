"use client";

import React, { useState } from 'react';
import { Upload, X, Loader2, CheckCircle2, Film, Image as ImageIcon } from 'lucide-react';

interface CloudinaryUploaderProps {
  onUploadSuccess: (url: string) => void;
  resourceType?: 'image' | 'video' | 'auto';
  label?: string;
}

export default function CloudinaryUploader({ onUploadSuccess, resourceType = 'auto', label = 'Dosya Yükle' }: CloudinaryUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'gvpu61no'); // User's precise Unsigned Preset

    // Need Cloud Name from environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      alert("HATA: .env.local dosyasına NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME eklenmemiş!");
      setUploading(false);
      return;
    }

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          onUploadSuccess(response.secure_url);
        } else {
          alert("Yükleme başarısız oldu: " + xhr.responseText);
        }
        setUploading(false);
      };

      xhr.onerror = () => {
        alert("Bir hata oluştu (İnternet bağlantısı veya CORS sorunu).");
        setUploading(false);
      };

      xhr.send(formData);
    } catch (error) {
      console.error(error);
      alert("Hata!");
      setUploading(false);
    }
  };

  return (
    <div className="relative group cursor-pointer border-2 border-dashed border-dublio-cyan/30 hover:border-dublio-cyan bg-[#1a1c23] hover:bg-[#1f222b] rounded-xl p-4 flex flex-col items-center justify-center transition-all h-full min-h-[100px]">
      <input 
        type="file" 
        accept={resourceType === 'image' ? 'image/*' : resourceType === 'video' ? 'video/*' : 'image/*,video/*'} 
        onChange={handleFileChange} 
        disabled={uploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
      />
      
      {uploading ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-dublio-cyan animate-spin" />
          <span className="text-dublio-cyan font-black text-sm">{progress}%</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          {resourceType === 'video' ? <Film className="w-8 h-8 text-white/30 group-hover:text-dublio-cyan transition-colors" /> : <ImageIcon className="w-8 h-8 text-white/30 group-hover:text-dublio-cyan transition-colors" />}
          <span className="text-white/50 text-xs font-bold uppercase tracking-widest text-center">{label}</span>
          <span className="text-white/20 text-[10px]">Tıkla veya Sürükle</span>
        </div>
      )}
    </div>
  );
}
