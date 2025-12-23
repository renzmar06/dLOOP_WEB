export interface Submaterial {
  id: string;
  enabled: boolean;
  submaterialname: string;
  programType: string;
  materialType: string;
  unitType: string;
  crvPrice: number;
  scrapPrice: number;
  perUnit: number;
  minQuantity: number;
  maxQuantity: number;
  specialNotes: string;
}

export interface Material {
  _id?: string;
  materialname: string;
  materialType: string;
  unitType: string;
  crvPrice: number;
  scrapPrice: number;
  perUnit: number;
  minQuantity: number;
  maxQuantity: number;
  specialNotes: string;
  submaterial: Submaterial[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMaterialRequest {
  materialname: string;
  materialType: string;
  unitType: string;
  crvPrice: string;
  scrapPrice: string;
  perUnit: string;
  minQuantity: string;
  maxQuantity: string;
  specialNotes: string;
  submaterial: Submaterial[];
}