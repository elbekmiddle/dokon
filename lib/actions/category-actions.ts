'use server';

// 1) Barcha kategoriyalarni olish
export const getCategories = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
      cache: 'no-store' // Agar yangi ma'lumot kerak bo'lsa
    });

    if (!res.ok) {
      throw new Error('Kategoriyalarni olishda xato yuz berdi');
    }

    return await res.json();
  } catch (error) {
    console.error('Kategoriyalarni olishda xato:', error);
    return [];
  }
};

// 2) Yangi kategoriya qo'shish
export const addCategory = async (name: string, slug: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, slug }),
    });

    if (!res.ok) {
      throw new Error('Kategoriya qo\'shishda xato');
    }

    return await res.json();
  } catch (error) {
    console.error('Kategoriya qo\'shishda xato:', error);
    throw error;
  }
};

// 3) Kategoriyani o'chirish
export const deleteCategory = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Kategoriyani o\'chirishda xato');
    }

    return await res.json();
  } catch (error) {
    console.error('Kategoriyani o\'chirishda xato:', error);
    throw error;
  }
};

// 4) Kategoriyani yangilash
export const updateCategory = async (id: string, name: string, slug: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, slug }),
    });

    if (!res.ok) {
      throw new Error('Kategoriyani yangilashda xato');
    }

    return await res.json();
  } catch (error) {
    console.error('Kategoriyani yangilashda xato:', error);
    throw error;
  }
};