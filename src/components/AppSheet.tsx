import { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
export default function AppSheet({ open, onClose, title, description, children }: { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode }) {
 return <Dialog open={open} onOpenChange={value => { if (!value) onClose(); }}><DialogContent className="app-sheet"><div className="sheet-handle"/><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription className={description ? '' : 'sr-only'}>{description || title}</DialogDescription></DialogHeader><div className="sheet-body">{children}</div></DialogContent></Dialog>;
}
