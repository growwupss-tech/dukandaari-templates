import { useMemo } from "react";
import Fuse from "fuse.js";
import ProductCard from "./ProductCard";
import { useSiteContent } from "@/hooks/useSiteContent";

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
}

const ProductGrid = ({ searchQuery = "", selectedCategory = "" }: ProductGridProps) => {
  const { products } = useSiteContent();
  
  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: ["name", "category", "description"],
        threshold: 0.3,
        includeScore: true,
      }),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = products;

    // Apply fuzzy search if there's a search query
    if (searchQuery.trim()) {
      const fuseResults = fuse.search(searchQuery);
      result = fuseResults.map((r) => r.item);
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((product) =>
        product.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Sort: in-stock products first, out-of-stock last
    result = result.sort((a, b) => {
      if (a.visibility === b.visibility) return 0;
      return a.visibility ? -1 : 1;
    });

    return result;
  }, [searchQuery, selectedCategory, products, fuse]);

  return (
    <section className="py-16 bg-background" id="products">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl text-muted-foreground mb-2">No results found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;

// Export products for use in CategoryNav
export const useProducts = () => {
  const { products } = useSiteContent();
  return products;
};
