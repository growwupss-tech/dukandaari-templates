import { useState } from "react";
import { ShoppingCart, MessageCircle, Minus, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  rating?: number;
  inStock?: boolean;
  visibility?: boolean;
}

const ProductCard = ({ id, name, price, image, category, description, rating = 4.5, inStock = true, visibility = true }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(0);
  const { addToCart } = useCart();

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(0, prev - 1));

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart({ id, name, price, image, category, description, quantity });
      setQuantity(0);
    }
  };

  const handleWhatsAppInquiry = () => {
    const message = `Hi! I'm interested in ${name}${quantity > 0 ? ` (${quantity} unit${quantity > 1 ? "s" : ""})` : ""}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 ${!visibility ? 'opacity-70' : ''}`}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover hover:scale-105 transition-transform duration-300 ${!visibility ? 'blur-sm' : ''}`}
        />
        <Badge className={`absolute top-2 right-2 ${!visibility ? 'opacity-50' : ''}`}>{category}</Badge>
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg py-2 px-4 bg-destructive/90">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className={`font-semibold text-lg mb-2 line-clamp-2 ${!visibility ? 'text-muted-foreground' : ''}`}>{name}</h3>
        {description && (
          <p className={`text-sm line-clamp-2 mb-2 ${!visibility ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
            {description}
          </p>
        )}
        <div className="flex items-center gap-1 mb-2">
          <Star className={`h-4 w-4 ${!visibility ? 'fill-muted-foreground/50 text-muted-foreground/50' : 'fill-primary text-primary'}`} />
          <span className={`text-sm font-medium ${!visibility ? 'text-muted-foreground/70' : ''}`}>{rating}</span>
        </div>
        <p className={`text-2xl font-bold ${!visibility ? 'text-muted-foreground' : 'text-primary'}`}>${price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <div className="flex items-center justify-center gap-3 w-full">
          <Button
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
            className="h-8 w-8"
            disabled={!visibility}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-lg w-12 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            className="h-8 w-8"
            disabled={!visibility}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button 
            variant="default" 
            size="sm" 
            className="w-full"
            onClick={handleAddToCart}
            disabled={quantity === 0 || !inStock || !visibility}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
          <Button
            variant="accent"
            size="sm"
            className="w-full"
            onClick={handleWhatsAppInquiry}
            disabled={!inStock || !visibility}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Inquire
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
