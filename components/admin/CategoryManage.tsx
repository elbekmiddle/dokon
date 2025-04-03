"use client";

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Category {
  _id: string;
  value: string;
  label: string;
  createdAt: string;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
      } else {
        toast.error(data.message || 'Kategoriyalarni yuklashda xatolik');
      }
    } catch (error) {
      toast.error('Server xatosi, kategoriyalarni yuklab bo\'lmadi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Kategoriya nomi bo'sh bo'lishi mumkin emas");
      return;
    }

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategory }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Kategoriya qo\'shishda xatolik');
      }

      toast.success("Kategoriya muvaffaqiyatli qo'shildi!");
      setNewCategory('');
      loadCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Server xatosi');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory(category.label);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategory.trim()) {
      toast.error("Kategoriya nomi bo'sh bo'lishi mumkin emas");
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategory }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Kategoriyani yangilashda xatolik');
      }

      toast.success("Kategoriya muvaffaqiyatli yangilandi!");
      setEditingCategory(null);
      setNewCategory('');
      loadCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Server xatosi');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Haqiqatan ham ushbu kategoriyani o\'chirmoqchimisiz?')) {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: 'DELETE',
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Kategoriyani o\'chirishda xatolik');
        }

        toast.success("Kategoriya muvaffaqiyatli o'chirildi!");
        loadCategories();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Server xatosi');
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Kategoriyalarni Boshqarish</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingCategory ? 'Kategoriyani Tahrirlash' : 'Yangi Kategoriya Qo\'shish'}
        </h2>
        
        <div className="flex gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Kategoriya nomi"
            className="border p-2 rounded flex-1"
          />
          
          {editingCategory ? (
            <>
              <button
                onClick={handleUpdateCategory}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Yangilash
              </button>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setNewCategory('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Bekor qilish
              </button>
            </>
          ) : (
            <button
              onClick={handleAddCategory}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Qo'shish
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Mavjud Kategoriyalar</h2>
        
        {isLoading ? (
          <div className="text-center py-4">Yuklanmoqda...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Kategoriyalar mavjud emas</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Nomi</th>
                  <th className="py-3 px-4 text-left">Yaratilgan sana</th>
                  <th className="py-3 px-4 text-left">Harakatlar</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{category.label}</td>
                    <td className="py-3 px-4">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        O'chirish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}