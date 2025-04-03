"use client";

import Link from 'next/link';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
  imageUrlv1?: string;
  imageUrlv2?: string;
  imageUrlv3?: string;
  imageUrlv4?: string;
  colors?: string[];
}

interface ProductsTableProps {
  products: Product[];
}

const categories = [
  "elektronika",
  "kiyim", 
  "oziq-ovqat",
  "uy-ro'zg'or"
];

export default function ProductsTable({ products }: ProductsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});

  const handleEditClick = (product: Product) => {
    setEditingId(product._id);
    setEditedProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleUpdate = async (productId: string) => {
    const updateToast = toast.loading("Mahsulot yangilanmoqda...");
    
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProduct),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Yangilashda xatolik yuz berdi');
      }

      toast.update(updateToast, {
        render: "Mahsulot muvaffaqiyatli yangilandi!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
      
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Update error:', error);
      toast.update(updateToast, {
        render: error instanceof Error ? error.message : 'Server xatosi, qayta urinib ko\'ring',
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Haqiqatan ham ushbu mahsulotni o\'chirmoqchimisiz?')) {
      const deleteToast = toast.loading("Mahsulot o'chirilmoqda...");
      
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.update(deleteToast, {
            render: "Mahsulot muvaffaqiyatli o'chirildi!",
            type: "success",
            isLoading: false,
            autoClose: 3000
          });
          setTimeout(() => window.location.reload(), 1000);
        } else {
          const error = await response.json();
          throw new Error(error.message || 'O\'chirishda xatolik yuz berdi');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.update(deleteToast, {
          render: error instanceof Error ? error.message : 'Server xatosi, qayta urinib ko\'ring',
          type: "error",
          isLoading: false,
          autoClose: 3000
        });
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <table className="min-w-full bg-white">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-4 text-left">Rasm</th>
            <th className="py-3 px-4 text-left">Nomi</th>
            <th className="py-3 px-4 text-left">Kategoriya</th>
            <th className="py-3 px-4 text-left">Narx</th>
            <th className="py-3 px-4 text-left">Soni</th>
            <th className="py-3 px-4 text-left">Harakatlar</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
              </td>
              <td className="py-3 px-4">
                {editingId === product._id ? (
                  <input
                    type="text"
                    name="name"
                    value={editedProduct.name || ''}
                    onChange={handleInputChange}
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  product.name
                )}
              </td>
              <td className="py-3 px-4">
                {editingId === product._id ? (
                  <select
                    name="category"
                    value={editedProduct.category || ''}
                    onChange={handleInputChange}
                    className="border p-1 rounded"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                ) : (
                  product.category
                )}
              </td>
              <td className="py-3 px-4">
                {editingId === product._id ? (
                  <input
                    type="number"
                    name="price"
                    value={editedProduct.price || ''}
                    onChange={handleInputChange}
                    className="border p-1 rounded w-24"
                  />
                ) : (
                  product.price.toLocaleString() + ' so\'m'
                )}
              </td>
              <td className="py-3 px-4">
                {editingId === product._id ? (
                  <input
                    type="number"
                    name="stock"
                    value={editedProduct.stock || ''}
                    onChange={handleInputChange}
                    className="border p-1 rounded w-20"
                  />
                ) : (
                  product.stock
                )}
              </td>
              <td className="py-3 px-4 space-x-2">
                {editingId === product._id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(product._id)}
                      className="text-green-500 hover:text-green-700"
                    >
                      Saqlash
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 hover:text-gray-700 ml-2"
                    >
                      Bekor qilish
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(product)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Tahrirlash
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      O'chirish
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}