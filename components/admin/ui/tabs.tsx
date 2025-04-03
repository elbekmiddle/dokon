// components/admin/AdminTabs.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductsTable from '../ProductsTable';
import CategoryManager from '../CategoryManage';
import OrdersTable from '../OrdersTable';

export function AdminTabs() {
  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="products">Mahsulotlar</TabsTrigger>
        <TabsTrigger value="categories">Kataloglar</TabsTrigger>
        <TabsTrigger value="orders">Buyurtmalar</TabsTrigger>
      </TabsList>

      <TabsContent value="products">
        <div className="mt-6">
          <ProductsTable products={[]} />
        </div>
      </TabsContent>

      <TabsContent value="categories">
        <div className="mt-6">
          <CategoryManager />
        </div>
      </TabsContent>

      <TabsContent value="orders">
        <div className="mt-6">
          <OrdersTable />
        </div>
      </TabsContent>
    </Tabs>
  );
}