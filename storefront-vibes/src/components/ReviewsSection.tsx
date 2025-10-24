import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSiteContent } from "@/hooks/useSiteContent";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ReviewsSection = () => {
  const { reviews } = useSiteContent();
  
  // Sort reviews by rating from high to low
  const sortedReviews = [...reviews].sort((a, b) => b.rating - a.rating);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Customer Reviews</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {sortedReviews.map((review, index) => (
              <CarouselItem key={index} className="md:basis-1/3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {review.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{review.name}</div>
                        <div className="text-sm text-muted-foreground">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-accent text-accent"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold">{review.rating}/5</span>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default ReviewsSection;
