// components/admin/OrdersTable.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Buyurtmalar ma'lumotlari tipi
interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment: 'paid' | 'unpaid';
}

export default function OrdersTable() {
  // Namuna ma'lumotlar (aslida API dan olinadi)
  const orders: Order[] = [
    {
      id: 'ORD-001',
      customer: 'Ali Valiyev',
      date: '2023-05-15',
      amount: 1250000,
      status: 'completed',
      payment: 'paid'
    },
    {
      id: 'ORD-002',
      customer: 'Hasan Husanov',
      date: '2023-05-16',
      amount: 850000,
      status: 'processing',
      payment: 'paid'
    },
    {
      id: 'ORD-003',
      customer: 'Lola Karimova',
      date: '2023-05-17',
      amount: 450000,
      status: 'pending',
      payment: 'unpaid'
    },
  ];

  // Statusga qarang badge rangini belgilash
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Yakunlangan</Badge>;
      case 'processing':
        return <Badge variant="secondary">Jarayonda</Badge>;
      case 'pending':
        return <Badge variant="outline">Kutilmoqda</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Bekor qilingan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // To'lov holatini ko'rsatish
  const getPaymentBadge = (payment: string) => {
    return payment === 'paid' 
      ? <Badge variant="default">To'langan</Badge>
      : <Badge variant="destructive">To'lanmagan</Badge>;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Buyurtma ID</TableHead>
            <TableHead>Mijoz</TableHead>
            <TableHead>Sana</TableHead>
            <TableHead>Summa</TableHead>
            <TableHead>Holati</TableHead>
            <TableHead>To'lov</TableHead>
            <TableHead className="text-right">Harakatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
              <TableCell>{order.amount.toLocaleString()} so'm</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell>{getPaymentBadge(order.payment)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Batafsil</DropdownMenuItem>
                    <DropdownMenuItem>Tahrirlash</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">
                      Bekor qilish
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}