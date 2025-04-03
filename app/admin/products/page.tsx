// In `app/admin/products/page.tsx`
import { getProducts } from '@/lib/actions/products';
import ProductsTable from '@/components/admin/ProductsTable';
import Link from 'next/link';

export default async function ProductsPage() {
  const products = await getProducts();
  
  // Ensure products are valid before rendering
  if (!products) {
    return <p>No products found</p>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          Add New Product
        </Link>
      </div>
      
      <ProductsTable products={products} />
    </div>
  );
}
