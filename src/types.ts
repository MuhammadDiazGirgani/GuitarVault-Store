export interface Product {
  id: number;  
  title: string;
  category: string;
  price_usd: number;
  price_idr: number;
  image: string;
  weight?: string;
  dimensions?: string;
  model?: string;
  strings?: string;
  color?: string;
  materials?: string;
  qty?: number;
  original_price?: number;
discounted_price?: number;
is_weekend_sale?: boolean;
}

export interface RawProduct {
  id?: string | number;
  title?: string;
  category?: string | { name?: string; label?: string } | null;
  category_name?: string;
  price?: number;
  price_usd?: number;
  price_idr?: number;
  image?: string | { url?: string };
  images?: (string | { url?: string })[];
  weight?: string;
  dimensions?: string;
  model?: string;
  strings?: string;
  color?: string;
  materials?: string;
}


export interface CartItem {
  id: number;
  title: string;
  price_usd: number;
  price_idr?: number;
  qty?: number;
  price?: number;
  quantity?: number;
}

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  payment?: string;
  status?: string;
}
