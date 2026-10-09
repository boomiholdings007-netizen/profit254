import { Coins, Zap, Shield, Sparkles, DollarSign } from 'lucide-react';
const assetIcons = [Coins, Zap, Shield, Sparkles, DollarSign];
export default function MarketIcon({ asset }: { asset: number }) { const Icon = assetIcons[asset] ?? Coins; return <Icon aria-hidden />; }
