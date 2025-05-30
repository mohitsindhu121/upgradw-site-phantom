import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface PaymentGatewayProps {
  paymentOption: {
    id: string;
    name: string;
    monthlyAmount: number;
    totalAmount: number;
    totalMonths: number;
  };
  product: {
    name: string;
    productId: string;
  };
  onPaymentSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

export default function PaymentGateway({ paymentOption, product, onPaymentSuccess, onCancel }: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const { toast } = useToast();

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: "📱", description: "GPay, PhonePe, Paytm" },
    { id: "netbanking", name: "Net Banking", icon: "🏦", description: "सभी प्रमुख बैंक" },
    { id: "card", name: "Debit/Credit Card", icon: "💳", description: "Visa, Mastercard, RuPay" },
    { id: "cod", name: "Cash on Delivery", icon: "💵", description: "डिलीवरी पर भुगतान" }
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast({
        title: "भुगतान विधि चुनें",
        description: "कृपया एक भुगतान विधि का चयन करें",
        variant: "destructive"
      });
      return;
    }

    if (!customerDetails.name || !customerDetails.phone) {
      toast({
        title: "जानकारी अधूरी है",
        description: "कृपया नाम और मोबाइल नंबर भरें",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: selectedMethod,
          amount: paymentOption.monthlyAmount,
          productId: product.productId,
          customerDetails,
          paymentOption: paymentOption.id
        }),
      });

      if (!response.ok) {
        throw new Error("Payment processing failed");
      }

      const data = await response.json();
      
      // For demonstration, we'll simulate different payment flows
      if (selectedMethod === "cod") {
        toast({
          title: "ऑर्डर कन्फर्म!",
          description: "आपका ऑर्डर बुक हो गया है। डिलीवरी पर भुगतान करें।",
        });
        onPaymentSuccess("COD_" + Date.now());
      } else if (selectedMethod === "upi") {
        // In real implementation, you would redirect to UPI app or show QR code
        const upiId = "mohitsindhu121@paytm"; // Your UPI ID
        const upiLink = `upi://pay?pa=${upiId}&pn=Phantoms Corporation&am=${paymentOption.monthlyAmount}&cu=INR&tn=Payment for ${product.name}`;
        
        toast({
          title: "UPI भुगतान",
          description: "अपनी UPI app खोलें और भुगतान करें",
        });
        
        // Open UPI link
        window.open(upiLink, "_blank");
        
        // For demo, auto-confirm after 5 seconds
        setTimeout(() => {
          onPaymentSuccess("UPI_" + Date.now());
        }, 5000);
      } else {
        // For other methods, simulate success
        setTimeout(() => {
          onPaymentSuccess(selectedMethod.toUpperCase() + "_" + Date.now());
        }, 3000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "भुगतान में त्रुटि",
        description: "कृपया दोबारा कोशिश करें या अन्य विधि चुनें",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Order Summary */}
      <Card className="border-[#8B5CF6]/30 bg-[#1A1A2E]/80">
        <CardHeader>
          <CardTitle className="text-white">ऑर्डर सारांश</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-white">{product.name}</h3>
              <p className="text-sm text-gray-400">{paymentOption.name}</p>
            </div>
            <Badge className="bg-[#00FFFF]/20 text-[#00FFFF] border-[#00FFFF]/50">
              {product.productId}
            </Badge>
          </div>
          <Separator className="bg-[#8B5CF6]/30" />
          <div className="space-y-2">
            <div className="flex justify-between text-white">
              <span>भुगतान राशि:</span>
              <span className="font-bold text-[#00FFFF]">₹{paymentOption.monthlyAmount.toLocaleString()}</span>
            </div>
            {paymentOption.totalMonths > 1 && (
              <div className="flex justify-between text-gray-400 text-sm">
                <span>कुल किस्तें:</span>
                <span>{paymentOption.totalMonths} महीने</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Details */}
      <Card className="border-[#8B5CF6]/30 bg-[#1A1A2E]/80">
        <CardHeader>
          <CardTitle className="text-white">ग्राहक जानकारी</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white">नाम *</Label>
              <Input
                id="name"
                value={customerDetails.name}
                onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                className="bg-[#16213E] border-[#8B5CF6]/30 text-white"
                placeholder="आपका नाम"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-white">मोबाइल नंबर *</Label>
              <Input
                id="phone"
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                className="bg-[#16213E] border-[#8B5CF6]/30 text-white"
                placeholder="9876543210"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">ईमेल</Label>
              <Input
                id="email"
                type="email"
                value={customerDetails.email}
                onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                className="bg-[#16213E] border-[#8B5CF6]/30 text-white"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label htmlFor="address" className="text-white">पता</Label>
              <Input
                id="address"
                value={customerDetails.address}
                onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                className="bg-[#16213E] border-[#8B5CF6]/30 text-white"
                placeholder="डिलीवरी पता"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="border-[#8B5CF6]/30 bg-[#1A1A2E]/80">
        <CardHeader>
          <CardTitle className="text-white">भुगतान विधि चुनें</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-[#00FFFF] bg-[#00FFFF]/10'
                    : 'border-[#8B5CF6]/30 hover:border-[#8B5CF6]/50'
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white">{method.name}</h4>
                    <p className="text-sm text-gray-400">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Actions */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-[#8B5CF6]/50 text-white hover:bg-[#8B5CF6]/20"
          disabled={isProcessing}
        >
          वापस जाएं
        </Button>
        <Button
          onClick={handlePayment}
          disabled={isProcessing || !selectedMethod}
          className="flex-1 bg-gradient-to-r from-[#8B5CF6] to-[#00FFFF] hover:from-[#00FFFF] hover:to-[#8B5CF6] text-white font-semibold"
        >
          {isProcessing ? "प्रोसेसिंग..." : `₹${paymentOption.monthlyAmount.toLocaleString()} का भुगतान करें`}
        </Button>
      </div>

      {/* Help Section */}
      <Card className="border-[#8B5CF6]/30 bg-[#1A1A2E]/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-white">सहायता चाहिए?</h4>
            <p className="text-sm text-gray-400">
              WhatsApp: +91 9876543210 | Email: mohitsindhu121@gmail.com
            </p>
            <p className="text-xs text-gray-500">
              सुरक्षित भुगतान | 256-bit SSL एन्क्रिप्शन | 100% रिफंड गारंटी
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}