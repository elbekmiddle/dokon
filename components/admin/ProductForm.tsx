'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/utils/cloudinary';

interface ProductFormProps {
  initialData?: {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    imageUrl: string;
    imageUrlv1: string;
    imageUrlv2: string;
    imageUrlv3: string;
    imageUrlv4: string;
    colors: string[];
  };
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

const categories = ["elektronika", "kiyim", "oziq-ovqat", "uy-ro'zg'or"];
const colorOptions = ["yashil", "oq", "sariq", "qizil"];

export default function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const router = useRouter();
  const [images, setImages] = useState({
    main: initialData?.imageUrl || '',
    v1: initialData?.imageUrlv1 || '',
    v2: initialData?.imageUrlv2 || '',
    v3: initialData?.imageUrlv3 || '',
    v4: initialData?.imageUrlv4 || ''
  });
  const [selectedColors, setSelectedColors] = useState<string[]>(initialData?.colors || []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof images) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadImage(file) as { secure_url: string };
      setImages(prev => ({ ...prev, [field]: result.secure_url }));
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Rasm yuklashda xatolik yuz berdi');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Add images and colors to form data
    Object.entries(images).forEach(([key, value]) => {
      formData.append(key, value);
    });
    selectedColors.forEach(color => formData.append('colors', color));

    await onSubmit(formData);
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color) 
        : [...prev, color]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Asosiy ma'lumotlar</h2>
          
          <div>
            <label className="block mb-1">Nomi</label>
            <input
              name="name"
              defaultValue={initialData?.name}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Tavsif</label>
            <textarea
              name="description"
              defaultValue={initialData?.description}
              required
              rows={4}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Kategoriya</label>
            <select
              name="category"
              defaultValue={initialData?.category}
              required
              className="w-full p-2 border rounded"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Narx va inventarizatsiya</h2>
          
          <div>
            <label className="block mb-1">Narx (so'm)</label>
            <input
              name="price"
              type="number"
              defaultValue={initialData?.price}
              required
              min="0"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Soni</label>
            <input
              name="stock"
              type="number"
              defaultValue={initialData?.stock}
              required
              min="0"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Ranglar</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleColor(color)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedColors.includes(color)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
            <input type="hidden" name="colors" value={selectedColors.join(',')} />
          </div>
        </div>
      </div>

      {/* Image Uploads */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Rasmlar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <ImageUploadField 
            label="Asosiy rasm"
            value={images.main}
            onChange={(e) => handleImageUpload(e, 'main')}
          />
          <ImageUploadField 
            label="Variant 1"
            value={images.v1}
            onChange={(e) => handleImageUpload(e, 'v1')}
          />
          <ImageUploadField 
            label="Variant 2"
            value={images.v2}
            onChange={(e) => handleImageUpload(e, 'v2')}
          />
          <ImageUploadField 
            label="Variant 3"
            value={images.v3}
            onChange={(e) => handleImageUpload(e, 'v3')}
          />
          <ImageUploadField 
            label="Variant 4"
            value={images.v4}
            onChange={(e) => handleImageUpload(e, 'v4')}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border rounded"
          disabled={isLoading}
        >
          Bekor qilish
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={isLoading || selectedColors.length !== 4}
        >
          {isLoading ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
      </div>
    </form>
  );
}

function ImageUploadField({ label, value, onChange }: { 
  label: string; 
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
        id={`upload-${label}`}
      />
      <label
        htmlFor={`upload-${label}`}
        className="block w-full h-32 border-2 border-dashed rounded flex items-center justify-center cursor-pointer"
      >
        {value ? (
          <img src={value} alt={label} className="h-full w-full object-cover" />
        ) : (
          <span className="text-gray-500">Rasm yuklash</span>
        )}
      </label>
    </div>
  );
}