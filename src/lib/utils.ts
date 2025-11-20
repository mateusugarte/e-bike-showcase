import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parsePrice(price: string | null): number {
  if (!price) return 0;
  
  // Remove currency symbols and spaces
  const cleaned = price.replace(/[R$\s]/g, "");
  
  // Check if it's Brazilian format (has comma as decimal separator)
  if (cleaned.includes(",")) {
    // Brazilian format: 10.299,00
    // Remove dots (thousand separators) and replace comma with dot
    return parseFloat(cleaned.replace(/\./g, "").replace(",", "."));
  } else {
    // American format: 10299.00 or just numbers
    return parseFloat(cleaned);
  }
}
