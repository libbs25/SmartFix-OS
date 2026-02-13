
import React, { useRef } from 'react';
import { ServiceOrder } from '../../types';
import { Camera, Image as ImageIcon, QrCode, Plus, X } from 'lucide-react';

interface PhotosTabProps {
  os: ServiceOrder;
  onUpdate: (photos: string[]) => void;
}

export const PhotosTab: React.FC<PhotosTabProps> = ({ os, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUpdate([...os.photos, base64String]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (indexToRemove: number) => {
    const updatedPhotos = os.photos.filter((_, index) => index !== indexToRemove);
    onUpdate(updatedPhotos);
  };

  const triggerCamera = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300 pb-24">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleCapture}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      <div className="grid grid-cols-2 gap-4">
        {os.photos.map((photo, index) => (
          <div key={index} className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-slate-100 shadow-md border border-slate-200 group">
            <img 
              src={photo} 
              alt={`Foto do dispositivo ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removePhoto(index);
              }}
              className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-2xl shadow-xl active:scale-90 transition-all z-20 hover:bg-red-600 border border-white/20"
              title="Remover foto"
            >
              <X size={18} strokeWidth={3} />
            </button>

            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 border border-white/10">
              <ImageIcon size={12} />
              <span>FOTO {index + 1}</span>
            </div>
          </div>
        ))}
        
        <button 
          onClick={triggerCamera}
          className="aspect-[3/4] border-2 border-dashed border-slate-200 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all bg-white shadow-inner"
        >
          <div className="bg-slate-50 p-4 rounded-2xl">
            <Plus size={32} strokeWidth={3} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Adicionar</span>
        </button>
      </div>

      <div className="flex flex-col items-center gap-4 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-60">
           <QrCode size={14} />
           <span>Vincular via QR Code</span>
        </div>
        
        <button 
          onClick={triggerCamera}
          className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-2xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all uppercase text-sm tracking-widest"
        >
          <Camera size={22} />
          Tirar Foto agora
        </button>
      </div>
    </div>
  );
};
