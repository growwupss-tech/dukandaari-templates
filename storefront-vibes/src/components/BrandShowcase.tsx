import { useSiteContent } from "@/hooks/useSiteContent";

const BrandShowcase = () => {
  const { brandShowcase } = useSiteContent();
  
  return (
    <section id="about" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{brandShowcase.title}</h2>
            <p className="text-muted-foreground text-lg mb-6">
              {brandShowcase.subtitle}
            </p>
            <p className="text-muted-foreground">
              {brandShowcase.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {brandShowcase.stats.map((stat, index) => (
              <div 
                key={index} 
                className={`${index % 2 === 0 ? 'bg-primary/10' : 'bg-accent/10'} rounded-lg p-6 text-center`}
              >
                <div className={`text-4xl font-bold ${index % 2 === 0 ? 'text-primary' : 'text-accent'} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
