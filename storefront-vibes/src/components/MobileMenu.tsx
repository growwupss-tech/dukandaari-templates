import { X, Home, ShoppingBag, Info, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: "Home", href: "#home" },
  { icon: ShoppingBag, label: "Shop", href: "#products" },
  { icon: Info, label: "About Us", href: "#about" },
  { icon: Phone, label: "Contact", href: "#contact" },
];

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const handleNavClick = (href: string) => {
    onClose();
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[280px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            BrandName
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start text-base"
              onClick={() => handleNavClick(item.href)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
