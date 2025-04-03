'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData))
      });
      
      if (response.ok) {
        router.push('/admin/products');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
}