// Modèles de données — reflètent le diagramme de classes du mémoire

export type RoleUtilisateur = 'automobiliste' | 'agent' | 'administrateur';

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: RoleUtilisateur;
  dateInscription: string;
}

export type StatutPlace = 'libre' | 'occupee' | 'reservee';

export interface ZoneStationnement {
  id: number;
  nom: string;
  description: string;
  latitude: number;
  longitude: number;
  tarifHoraire: number; // en FCFA
  placesTotal: number;
  placesLibres: number;
}

export interface PlaceStationnement {
  id: number;
  numero: string;
  zoneId: number;
  statut: StatutPlace;
  latitude: number;
  longitude: number;
  tarifHoraire: number;
}

export type MethodePaiement = 'wave' | 'orange_money' | 'free_money';
export type StatutPaiement = 'en_attente' | 'valide' | 'echoue';

export interface Paiement {
  id: number;
  montant: number;
  methode: MethodePaiement;
  statut: StatutPaiement;
  datePaiement: string;
  reference: string;
}

export type StatutReservation = 'active' | 'terminee' | 'annulee';

export interface Reservation {
  id: number;
  zoneNom: string;
  placeNumero: string;
  dateReservation: string;
  heureDebut: string;
  dureeHeures: number;
  montantTotal: number;
  statut: StatutReservation;
  methode?: MethodePaiement;
}
