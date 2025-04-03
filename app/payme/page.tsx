"use client";
import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard } from "lucide-react";

const PaymentPage = () => {
  // State larni saqlash
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState<'personal' | 'corporate' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedCardBrand, setDetectedCardBrand] = useState<string | null>(null);

  // Karta raqamini formatlash
  const formatCardNumber = (value: string) => {
    return value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  // Karta turini aniqlash
  const detectCardBrand = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^9860/.test(cleaned)) return 'Humo';
    if (/^5614/.test(cleaned)) return 'Uzcard';
    return null;
  };

  // Input o'zgarishlarini boshqarish
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = formatCardNumber(value.slice(0, 16));
    setCardNumber(formattedValue);
    setDetectedCardBrand(detectCardBrand(formattedValue));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiryDate(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(value);
  };

  // Formani yuborish
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // To'lovni amalga oshirish (simulyatsiya)
    setTimeout(() => {
      console.log({
        cardNumber: cardNumber.replace(/\s/g, ''),
        expiryDate,
        cvv,
        cardType,
        cardBrand: detectedCardBrand
      });
      setIsLoading(false);
      alert("To'lov muvaffaqiyatli amalga oshirildi!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
      <div className="max-w-md mx-auto w-full">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
              Online Qurilish Materiallari Do'Koni
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="mb-6">
              <p className="text-xs sm:text-sm text-gray-600 mb-4 text-center">
                Barcha to'lovlar shaxsiy karta yoki Click orqali amalga oshiriladi
              </p>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
                Karta ma'lumotlaringizni kiriting
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="cardNumber" className="block text-xs sm:text-sm font-medium text-gray-700">
                      Karta raqami
                    </label>
                    {detectedCardBrand && (
                      <Badge variant="outline" className="flex items-center gap-1 text-xs sm:text-sm">
                        <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                        {detectedCardBrand}
                      </Badge>
                    )}
                  </div>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    required
                    className="w-full text-sm sm:text-base"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Muddat (MM/YY)
                    </label>
                    <Input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <Input
                      id="cvv"
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={handleCvvChange}
                      required
                      className="text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Karta haqida
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="personal"
                        checked={cardType === 'personal'}
                        onCheckedChange={() => setCardType('personal')}
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                      <label htmlFor="personal" className="text-xs sm:text-sm font-medium leading-none">
                        Shaxsiy karta
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="corporate"
                        checked={cardType === 'corporate'}
                        onCheckedChange={() => setCardType('corporate')}
                        className="h-4 w-4 sm:h-5 sm:w-5"
                      />
                      <label htmlFor="corporate" className="text-xs sm:text-sm font-medium leading-none">
                        Korporativ karta
                      </label>
                    </div>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-4 rounded-md shadow-sm text-sm sm:text-base"
                  disabled={isLoading || !cardType}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Amalga oshirilmoqda...
                    </>
                  ) : (
                    'Davom etish'
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;