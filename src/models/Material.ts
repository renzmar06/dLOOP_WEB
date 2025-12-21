export interface Material {
  _id?: string;
  name: string;
  materialType: string;
  unitType: string;
  crvPrice: number;
  scrapPrice: number;
  perUnit: number;
  minQuantity: string;
  maxQuantity: string;
  specialNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMaterialRequest {
  name: string;
  materialType: string;
  unitType: string;
  crvPrice: string;
  scrapPrice: string;
  perUnit: string;
  minQuantity: string;
  maxQuantity: string;
  specialNotes: string;
}