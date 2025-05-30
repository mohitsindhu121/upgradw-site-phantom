import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Product } from "@shared/schema";

interface PaymentOptionsProps {
  product: Product;
  onPaymentSelect: (option: PaymentOption) => void;
}

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  salaryRange: string;
  monthlyAmount: number;
  totalMonths: number;
  processingFee: number;
  totalAmount: number;
  features: string[];
  recommended?: boolean;
}

export default function PaymentOptions({ product, onPaymentSelect }: PaymentOptionsProps) {
  const productPrice = parseFloat(product.price);
  
  const paymentOptions: PaymentOption[] = [
    {
      id: "immediate",
      name: "तुरंत भुगतान (Immediate Payment)",
      description: "एक बार में पूरा भुगतान करें",
      salaryRange: "₹50,000+ महीना",
      monthlyAmount: productPrice,
      totalMonths: 1,
      processingFee: 0,
      totalAmount: productPrice,
      features: ["तुरंत डिलीवरी", "कोई अतिरिक्त शुल्क नहीं", "1 साल की वारंटी"]
    },
    {
      id: "emi_3",
      name: "3 महीने EMI",
      description: "3 आसान किस्तों में भुगतान",
      salaryRange: "₹30,000-₹50,000 महीना",
      monthlyAmount: Math.ceil((productPrice + (productPrice * 0.05)) / 3),
      totalMonths: 3,
      processingFee: productPrice * 0.05,
      totalAmount: productPrice + (productPrice * 0.05),
      features: ["5% प्रोसेसिंग फीस", "तुरंत डिलीवरी", "6 महीने की वारंटी"],
      recommended: true
    },
    {
      id: "emi_6",
      name: "6 महीने EMI",
      description: "6 आसान किस्तों में भुगतान",
      salaryRange: "₹20,000-₹35,000 महीना",
      monthlyAmount: Math.ceil((productPrice + (productPrice * 0.08)) / 6),
      totalMonths: 6,
      processingFee: productPrice * 0.08,
      totalAmount: productPrice + (productPrice * 0.08),
      features: ["8% प्रोसेसिंग फीस", "तुरंत डिलीवरी", "3 महीने की वारंटी"]
    },
    {
      id: "emi_12",
      name: "12 महीने EMI",
      description: "12 आसान किस्तों में भुगतान",
      salaryRange: "₹15,000-₹25,000 महीना",
      monthlyAmount: Math.ceil((productPrice + (productPrice * 0.12)) / 12),
      totalMonths: 12,
      processingFee: productPrice * 0.12,
      totalAmount: productPrice + (productPrice * 0.12),
      features: ["12% प्रोसेसिंग फीस", "तुरंत डिलीवरी", "1 महीने की वारंटी"]
    },
    {
      id: "advance_booking",
      name: "एडवांस बुकिंग (Advance Booking)",
      description: "अभी ₹5,000 दें, बाकी डिलीवरी पर",
      salaryRange: "₹10,000-₹20,000 महीना",
      monthlyAmount: 5000,
      totalMonths: 1,
      processingFee: 500,
      totalAmount: productPrice + 500,
      features: ["केवल ₹5,000 एडवांस", "₹500 बुकिंग फीस", "डिलीवरी 7-15 दिन", "कोई वारंटी नहीं"]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#00FFFF] bg-clip-text text-transparent">
          {product.name} के लिए भुगतान विकल्प
        </h3>
        <p className="text-gray-400 mt-2">अपनी सैलरी के अनुसार सबसे अच्छा विकल्प चुनें</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paymentOptions.map((option) => (
          <Card 
            key={option.id} 
            className={`relative transition-all hover:scale-105 cursor-pointer ${
              option.recommended 
                ? 'border-[#00FFFF] bg-gradient-to-br from-[#1A1A2E] to-[#16213E] shadow-lg shadow-[#00FFFF]/20' 
                : 'border-[#8B5CF6]/30 bg-[#1A1A2E]/80'
            }`}
            onClick={() => onPaymentSelect(option)}
          >
            {option.recommended && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#8B5CF6] to-[#00FFFF] text-white">
                सबसे लोकप्रिय
              </Badge>
            )}
            
            <CardHeader>
              <CardTitle className="text-white text-lg">{option.name}</CardTitle>
              <CardDescription className="text-gray-300">{option.description}</CardDescription>
              <Badge variant="outline" className="w-fit text-xs text-[#00FFFF] border-[#00FFFF]/50">
                {option.salaryRange}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00FFFF]">
                  ₹{option.monthlyAmount.toLocaleString()}
                </div>
                {option.totalMonths > 1 && (
                  <div className="text-sm text-gray-400">
                    प्रति महीना × {option.totalMonths} महीने
                  </div>
                )}
              </div>
              
              <Separator className="bg-[#8B5CF6]/30" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>मूल कीमत:</span>
                  <span>₹{productPrice.toLocaleString()}</span>
                </div>
                {option.processingFee > 0 && (
                  <div className="flex justify-between text-gray-300">
                    <span>प्रोसेसिंग फीस:</span>
                    <span>₹{option.processingFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-white">
                  <span>कुल राशि:</span>
                  <span>₹{option.totalAmount.toLocaleString()}</span>
                </div>
              </div>
              
              <Separator className="bg-[#8B5CF6]/30" />
              
              <div className="space-y-2">
                <h4 className="font-semibold text-white text-sm">विशेषताएं:</h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-[#00FFFF] rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                className={`w-full ${
                  option.recommended
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#00FFFF] hover:from-[#00FFFF] hover:to-[#8B5CF6]'
                    : 'bg-[#8B5CF6] hover:bg-[#00FFFF]'
                } text-white font-semibold`}
                onClick={(e) => {
                  e.stopPropagation();
                  onPaymentSelect(option);
                }}
              >
                यह विकल्प चुनें
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-[#1A1A2E]/50 border border-[#8B5CF6]/30 rounded-lg">
        <h4 className="font-semibold text-white mb-2">💡 भुगतान के तरीके:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
          <div className="text-center">
            <div className="text-[#00FFFF] font-semibold">UPI</div>
            <div>GPay, PhonePe, Paytm</div>
          </div>
          <div className="text-center">
            <div className="text-[#00FFFF] font-semibold">Net Banking</div>
            <div>सभी बैंक</div>
          </div>
          <div className="text-center">
            <div className="text-[#00FFFF] font-semibold">Card</div>
            <div>Debit/Credit</div>
          </div>
          <div className="text-center">
            <div className="text-[#00FFFF] font-semibold">Cash</div>
            <div>डिलीवरी पर</div>
          </div>
        </div>
      </div>
    </div>
  );
}