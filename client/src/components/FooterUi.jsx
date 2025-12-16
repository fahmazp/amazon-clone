import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function FooterUi() {
  const navLinks = [
    { href: '#', label: 'Home' },
    { href: '#', label: 'Services' },
    { href: '#', label: 'Help' },
    { href: '#', label: 'News' },
  ];

  return (
    <footer className="py-4 border-t bg-gray-100">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <a href="#" className="text-xl text-amber-800 font-bold tracking-tight">
            QuickStore
          </a>
          <div className="flex items-center gap-4">
            {navLinks.map((link) => (
              <Button key={link.label} asChild variant={'ghost'} size={'sm'} className="text-muted-foreground -mx-2">
                <a href={link.href}>{link.label}</a>
              </Button>
            ))}
          </div>
        </div>
        <hr className="my-1" />
        <div className="flex flex-col items-center justify-between gap-1 sm:flex-row-reverse">
          <Button variant={'ghost'} size="sm" className="text-muted-foreground -mx-2" asChild>
            <a href="#">
              <Mail className="size-4" />
              shop@quickstore.com
            </a>
          </Button>
          <p className="text-muted-foreground text-sm/6">© 2025 Quickstore — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
