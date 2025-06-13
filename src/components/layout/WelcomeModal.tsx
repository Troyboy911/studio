
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Lightbulb, Briefcase, X } from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md shadow-xl border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <Lightbulb className="mr-3 h-7 w-7 text-primary" /> Welcome to Dreamer!
          </DialogTitle>
          <DialogDescription className="pt-2 text-base text-muted-foreground">
            Your journey from idea to impact starts here. Choose your path:
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button asChild size="lg" onClick={onClose} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/dreamer/auth">
              <Lightbulb className="mr-2 h-5 w-5" /> I'm a Dreamer
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" onClick={onClose} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/investor/auth">
              <Briefcase className="mr-2 h-5 w-5" /> I'm an Investor
            </Link>
          </Button>
        </div>
        <DialogFooter className="sm:justify-center pt-2">
            <Button variant="ghost" onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">
             <X className="mr-1 h-4 w-4" /> Or explore the site
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
