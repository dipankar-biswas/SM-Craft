'use client';
import React, { useState } from 'react';
import { Plus, Palette } from 'lucide-react';
import { Color } from '../../data/initialData';
import { useApp } from '../../context/AppContext';

interface AddColorFormProps {
  colors: Color[];
  setColors: React.Dispatch<React.SetStateAction<Color[]>>;
}

const AddColorForm: React.FC<AddColorFormProps> = ({ colors, setColors }) => {
  const { isBn } = useApp();

  const [colorName, setColorName] = useState('');
  const [colorNameBn, setColorNameBn] = useState('');
  const [colorHex, setColorHex] = useState('#3B82F6');
  const [error, setError] = useState('');

  const onAddColor = (name: string, nameBn: string, hex: string) => {
    const id = Date.now().toString();
    setColors([...colors, { id, name, nameBn, hex }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colorName.trim() || !colorNameBn.trim() || !colorHex.trim()) {
      setError(isBn ? 'রঙের নাম এবং কোড দিন' : 'Enter all color fields');
      return;
    }
    onAddColor(colorName.trim(), colorNameBn.trim(), colorHex.trim());
    setColorName('');
    setColorNameBn('');
    setColorHex('#3B82F6');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          placeholder={isBn ? 'রঙের নাম (ইংরেজি)' : 'Name (English)'}
          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <input
          type="text"
          value={colorNameBn}
          onChange={(e) => setColorNameBn(e.target.value)}
          placeholder={isBn ? 'রঙের নাম (বাংলা)' : 'Name (Bangla)'}
          className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200">
          <input
            type="color"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
          />
          <input
            type="text"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            placeholder="#HexCode"
            className="flex-1 text-sm focus:outline-none uppercase font-mono tracking-wider"
            maxLength={7}
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          {isBn ? 'যোগ' : 'Add'}
        </button>
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </form>
  );
};

export default AddColorForm;