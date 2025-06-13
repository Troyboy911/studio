export default function Footer() {
  return (
    <footer className="bg-primary/5 py-6 mt-12">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} IDream. All rights reserved.</p>
        <p className="text-sm">Turning dreams into reality, one idea at a time.</p>
      </div>
    </footer>
  );
}
