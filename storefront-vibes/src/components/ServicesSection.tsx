import { Truck, Shield, Headphones, RotateCcw, LucideIcon } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const iconMap: Record<string, LucideIcon> = {
  Truck,
  Shield,
  Headphones,
  RotateCcw,
};

const ServicesSection = () => {
  const { services } = useSiteContent();
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Truck;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 mb-4">
                  <IconComponent className="h-8 w-8" />
                </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-primary-foreground/80">{service.description}</p>
            </div>
          );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
