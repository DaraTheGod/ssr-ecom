export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
};

export const products: Product[] = [
  { id: "1", name: "Wireless Headphones", price: 79.99, description: "Noise-cancelling over-ear headphones.", image: "/images/headphone.jpg" },
  { id: "2", name: "Smart Watch", price: 199.99, description: "Fitness tracking and notifications.", image: "/images/watch.jpg" },
  { id: "3", name: "Bluetooth Speaker", price: 49.99, description: "Portable with 12h battery.", image: "/images/speaker.jpg" },
  { id: "4", name: "Laptop Stand", price: 34.99, description: "Ergonomic aluminum stand.", image: "/images/stand.jpg" },
  { id: "5", name: "USB-C Hub", price: 59.99, description: "7-in-1 multiport adapter.", image: "/images/hub.jpg" },
  { id: "6", name: "Mechanical Keyboard", price: 129.99, description: "RGB backlit, hot-swappable.", image: "/images/keyboard.jpg" },
  { id: "7", name: "Webcam 4K", price: 89.99, description: "Plug-and-play streaming camera.", image: "/images/webcam.jpg" },
  { id: "8", name: "External SSD 1TB", price: 119.99, description: "USB 3.2 Gen 2 speeds.", image: "/images/ssd.jpg" },
  { id: "9", name: "Gaming Mouse", price: 69.99, description: "16K DPI, programmable buttons.", image: "/images/mouse.jpg" },
  { id: "10", name: "Desk Lamp LED", price: 39.99, description: "Touch control, 3 color temps.", image: "/images/lamp.jpg" },
];