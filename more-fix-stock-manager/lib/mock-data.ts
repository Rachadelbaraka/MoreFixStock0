import type { Category, Supplier, Product } from "./types"

export const initialCategories: Category[] = [
  { id: "cat-1", name: "Claviers", description: "Claviers mécaniques et membrane", createdAt: new Date().toISOString() },
  { id: "cat-2", name: "Souris", description: "Souris gaming et bureautique", createdAt: new Date().toISOString() },
  { id: "cat-3", name: "CPU", description: "Processeurs Intel et AMD", createdAt: new Date().toISOString() },
  { id: "cat-4", name: "GPU", description: "Cartes graphiques NVIDIA et AMD", createdAt: new Date().toISOString() },
  { id: "cat-5", name: "RAM", description: "Mémoire vive DDR4 et DDR5", createdAt: new Date().toISOString() },
  { id: "cat-6", name: "SSD", description: "Stockage SSD NVMe et SATA", createdAt: new Date().toISOString() },
  { id: "cat-7", name: "Accessoires", description: "Câbles, supports et autres accessoires", createdAt: new Date().toISOString() },
]

export const initialSuppliers: Supplier[] = [
  { id: "sup-1", name: "TechDistrib", email: "contact@techdistrib.fr", phone: "01 23 45 67 89", createdAt: new Date().toISOString() },
  { id: "sup-2", name: "InfoPro Supply", email: "commande@infopro.fr", phone: "01 98 76 54 32", createdAt: new Date().toISOString() },
  { id: "sup-3", name: "PC Parts Express", email: "sales@pcparts.com", phone: "01 11 22 33 44", createdAt: new Date().toISOString() },
]

export const initialProducts: Product[] = [
  { id: "prod-1", name: "Clavier Logitech G Pro", description: "Clavier mécanique gaming", categoryId: "cat-1", supplierId: "sup-1", price: 129.99, quantity: 15, sku: "LOG-GPRO-KB", createdAt: new Date().toISOString() },
  { id: "prod-2", name: "Clavier Corsair K70", description: "Clavier mécanique RGB", categoryId: "cat-1", supplierId: "sup-2", price: 149.99, quantity: 8, sku: "COR-K70-RGB", createdAt: new Date().toISOString() },
  { id: "prod-3", name: "Souris Logitech G502", description: "Souris gaming haute précision", categoryId: "cat-2", supplierId: "sup-1", price: 79.99, quantity: 25, sku: "LOG-G502-MS", createdAt: new Date().toISOString() },
  { id: "prod-4", name: "Souris Razer DeathAdder", description: "Souris gaming ergonomique", categoryId: "cat-2", supplierId: "sup-3", price: 69.99, quantity: 0, sku: "RAZ-DA-V3", createdAt: new Date().toISOString() },
  { id: "prod-5", name: "Intel Core i7-13700K", description: "Processeur 16 coeurs", categoryId: "cat-3", supplierId: "sup-2", price: 419.99, quantity: 5, sku: "INT-I7-13K", createdAt: new Date().toISOString() },
  { id: "prod-6", name: "AMD Ryzen 7 7800X3D", description: "Processeur gaming", categoryId: "cat-3", supplierId: "sup-1", price: 449.99, quantity: 3, sku: "AMD-R7-7800", createdAt: new Date().toISOString() },
  { id: "prod-7", name: "NVIDIA RTX 4070", description: "Carte graphique gaming", categoryId: "cat-4", supplierId: "sup-2", price: 599.99, quantity: 7, sku: "NV-RTX4070", createdAt: new Date().toISOString() },
  { id: "prod-8", name: "NVIDIA RTX 3060", description: "Carte graphique entrée de gamme", categoryId: "cat-4", supplierId: "sup-3", price: 329.99, quantity: 2, sku: "NV-RTX3060", createdAt: new Date().toISOString() },
  { id: "prod-9", name: "Corsair Vengeance 32GB DDR5", description: "Kit RAM 2x16GB 5600MHz", categoryId: "cat-5", supplierId: "sup-1", price: 149.99, quantity: 20, sku: "COR-VEN-32", createdAt: new Date().toISOString() },
  { id: "prod-10", name: "Samsung 990 Pro 1TB", description: "SSD NVMe PCIe 4.0", categoryId: "cat-6", supplierId: "sup-2", price: 129.99, quantity: 12, sku: "SAM-990-1T", createdAt: new Date().toISOString() },
  { id: "prod-11", name: "Câble HDMI 2.1 2m", description: "Câble haute vitesse 4K 120Hz", categoryId: "cat-7", supplierId: "sup-3", price: 19.99, quantity: 50, sku: "CAB-HDMI-2M", createdAt: new Date().toISOString() },
  { id: "prod-12", name: "Support écran ergonomique", description: "Bras articulé pour moniteur", categoryId: "cat-7", supplierId: "sup-1", price: 39.99, quantity: 0, sku: "SUP-MON-ARM", createdAt: new Date().toISOString() },
]
