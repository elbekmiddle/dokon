import  Product  from '@/model/product';
import connectDB from '@/lib/mongodb';

export async function getProducts() {
  try {
    await connectDB();
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .select('name price category stock imageUrl');
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    await connectDB();
    const product = await Product.findById(id);
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

export async function createProduct(formData: FormData) {
  try {
    await connectDB();
    
    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      category: formData.get('category'),
      stock: Number(formData.get('stock')),
      imageUrl: formData.get('imageUrl'),
      imageUrlv1: formData.get('imageUrlv1'),
      imageUrlv2: formData.get('imageUrlv2'),
      imageUrlv3: formData.get('imageUrlv3'),
      imageUrlv4: formData.get('imageUrlv4'),
      colors: formData.getAll('colors')
    };

    const product = new Product(productData);
    await product.save();
    
    return { success: true };
  } catch (error) {
    console.error('Failed to create product:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}