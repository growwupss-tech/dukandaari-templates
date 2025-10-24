import { useSiteContent } from "@/hooks/useSiteContent";

const BrandGallery = () => {
  const { brandGallery } = useSiteContent();

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Experience Our Brand</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {brandGallery.map((item, index) => (
            <div key={index} className="relative aspect-square group overflow-hidden rounded-lg">
              <img
                src={item.url}
                alt={item.text}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-4">
                <p className="text-foreground font-semibold">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandGallery;
