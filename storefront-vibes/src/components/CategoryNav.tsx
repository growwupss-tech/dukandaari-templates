import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";

interface Category {
  name: string;
  count: number;
}

interface CategoryNavProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const CategoryNav = ({ selectedCategory, onCategorySelect }: CategoryNavProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { products } = useSiteContent();

  // Generate categories dynamically from products
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    products.forEach(product => {
      const count = categoryMap.get(product.category) || 0;
      categoryMap.set(product.category, count + 1);
    });

    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count
    }));
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      onCategorySelect("");
    } else {
      onCategorySelect(categoryName);
    }
  };

  const clearFilter = () => {
    onCategorySelect("");
  };

  return (
    <div className="border-t bg-muted/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-muted-foreground">Browse:</span>
          <div className="flex gap-2 flex-wrap items-center">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                className="gap-1.5 h-8 text-xs font-medium rounded-full transition-all hover:scale-105"
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
                <span className="ml-1 opacity-70">({category.count})</span>
              </Button>
            ))}
          </div>
          {selectedCategory && (
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20">
              <span>{selectedCategory}</span>
              <X className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" onClick={clearFilter} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
