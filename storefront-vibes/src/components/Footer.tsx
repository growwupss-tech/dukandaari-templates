import { useState } from "react";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/useSiteContent";

const Footer = () => {
  const { footer } = useSiteContent();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [review, setReview] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback. We appreciate it!",
    });
    setName("");
    setEmail("");
    setReview("");
  };

  return (
    <footer id="contact" className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Leave a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Textarea
                placeholder="Write your review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                required
              />
              <Button type="submit" className="w-full">
                Submit Review
              </Button>
            </form>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Connect With Us</h3>
            <div className="flex gap-4 mb-6">
              <Button variant="outline" size="icon">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2 text-muted-foreground">
              <p>{footer.contact.address}</p>
              <p>Phone: {footer.contact.phone}</p>
              <p>Email: {footer.contact.email}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-muted-foreground">
          <p className="mb-2">{footer.about}</p>
          <p>&copy; 2024 All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
