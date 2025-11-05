import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const contactSchema = z.object({
  name: z.string().trim().max(100, "Name must be less than 100 characters")
    .transform(val => val?.replace(/[\r\n]/g, '') || '')
    .optional(),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters")
    .transform(val => val.replace(/[\r\n]/g, '')),
});

export const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validated = contactSchema.parse(formData);
      
      setIsSubmitting(true);

      // Call edge function to send email securely
      const { data, error: functionError } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: validated.name || "WeatherNow User",
          email: validated.email,
          message: validated.message,
        },
      });

      if (functionError) throw functionError;
      if (data?.error) throw new Error(data.error);

      if (data?.success) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        toast({
          title: "Message Sent! ✅",
          description: "Thank you for your feedback. We'll get back to you soon!",
        });
        
        // Reset success state after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto mb-12"
    >
      <div className="glass-strong rounded-3xl p-6 sm:p-8 backdrop-blur-md border border-white/20 shadow-2xl">
        <div className="text-center mb-6">
          <Mail className="w-12 h-12 text-white/90 mx-auto mb-3" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Contact Us
          </h2>
          <p className="text-white/70 text-sm sm:text-base">
            Have a suggestion or feedback? We'd love to hear from you!
          </p>
        </div>

        {isSuccess ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Message Sent Successfully!</h3>
            <p className="text-white/70">We'll get back to you soon.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/90 flex items-center gap-2">
                <User className="w-4 h-4" />
                Name (Optional)
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/40"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/40"
                required
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-white/90 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message / Suggestion *
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us what's on your mind..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/40 min-h-[120px] resize-none"
                required
                maxLength={1000}
              />
              <p className="text-xs text-white/50 text-right">
                {formData.message.length}/1000
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </motion.section>
  );
};
