"use client";
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, CreditCard, Home, Loader2, Truck } from "lucide-react";

const CheckoutPage = () => {
  const [selectedAddress, setSelectedAddress] = useState('address1');
  const [selectedPayment, setSelectedPayment] = useState('card1');
  const [addNewAddress, setAddNewAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Manzillar ro'yxati
  const addresses = [
    {
      id: 'address1',
      name: 'Jane Doe',
      address: '1234 Fake St',
      isDefault: true
    },
    {
      id: 'address2',
      name: 'John Doe',
      address: '5678 Example Ave',
      isDefault: false
    }
  ];

  // To'lov usullari
  const paymentMethods = [
    {
      id: 'card1',
      type: 'VISA',
      name: 'Jane Doe',
      number: '1234 **** **** 9012',
      isDefault: true
    }
  ];

  // Buyurtmani joylash
  const handlePlaceOrder = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Success toast yoki modal ko'rsatish
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Checkout form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Yetkazib berish manzili */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Yetkazib berish manzili
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Jane Doe</h3>
                    <p className="text-sm text-gray-600">1234 Fake St</p>
                  </div>
                  <Button variant="link" className="text-blue-600 p-0 h-auto">
                    O'zgartirish
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Standart yetkazish</span>
                    </div>
                    <span className="font-medium">$5</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Yetkazib berish muddati: <span className="font-medium">2-iyun, 2023</span>
                  </p>
                </div>

                <RadioGroup 
                  value={selectedAddress} 
                  onValueChange={setSelectedAddress}
                  className="space-y-3"
                >
                  {addresses.map((address) => (
                    <div key={address.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={address.id} id={address.id} />
                      <label htmlFor={address.id} className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{address.name}</span>
                          {address.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              Asosiy
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{address.address}</p>
                      </label>
                    </div>
                  ))}
                </RadioGroup>

                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setAddNewAddress(true)}
                >
                  Yangi manzil qo'shish
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* To'lov usuli */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                To'lov usuli
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Jane Doe</h3>
                    <p className="text-sm text-gray-600">VISA **** 9012</p>
                  </div>
                  <Button variant="link" className="text-blue-600 p-0 h-auto">
                    O'zgartirish
                  </Button>
                </div>

                <RadioGroup 
                  value={selectedPayment} 
                  onValueChange={setSelectedPayment}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-3">
                      <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                      <label htmlFor={`payment-${method.id}`} className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{method.type} •••• {method.number.slice(-4)}</span>
                          {method.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              Asosiy
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{method.name}</p>
                      </label>
                    </div>
                  ))}
                </RadioGroup>

                <Button variant="outline" className="w-full mt-4">
                  Boshqa to'lov usulini tanlash
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Order summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">
                Buyurtma xulosasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Mijoz ma'lumotlari</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Jane Doe</p>
                    <p>jane.doe@gmail.com</p>
                    <p>(123) 123-1234</p>
                    <p>1234 Fake St</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">To'lov usuli</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span>VISA •••• 9012</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Jarayonda...
                      </>
                    ) : (
                      'Buyurtma berish'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;