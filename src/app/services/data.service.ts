import { Injectable } from '@angular/core';
import {
  ZoneStationnement, Reservation, Utilisateur, MethodePaiement,
} from '../models/models';

// Service de données simulées : permet à l'application de fonctionner sans backend
// (utile pour la démonstration et les captures d'écran). À remplacer par des appels
// HTTP vers l'API Laravel une fois le backend disponible.
@Injectable({ providedIn: 'root' })
export class DataService {

  private utilisateur: Utilisateur = {
    id: 1,
    nom: 'DIAKHATE',
    prenom: 'Khadim',
    email: 'khadim.diakhate@email.sn',
    telephone: '77 123 45 67',
    role: 'automobiliste',
    dateInscription: '2026-01-15',
  };

  // Zones à forte densité de Dakar (coordonnées réelles approximatives)
  private zones: ZoneStationnement[] = [
    { id: 1, nom: 'Plateau — Place de l\'Indépendance', description: 'Centre administratif et commercial', latitude: 14.6690, longitude: -17.4390, tarifHoraire: 500, placesTotal: 120, placesLibres: 18 },
    { id: 2, nom: 'Almadies — Route de Ngor', description: 'Zone commerciale et de loisirs', latitude: 14.7440, longitude: -17.5150, tarifHoraire: 400, placesTotal: 80, placesLibres: 32 },
    { id: 3, nom: 'Plateau — Avenue Pompidou', description: 'Artère commerçante principale', latitude: 14.6730, longitude: -17.4420, tarifHoraire: 500, placesTotal: 95, placesLibres: 4 },
    { id: 4, nom: 'Point E — Rue de Kaolack', description: 'Quartier résidentiel et bureaux', latitude: 14.6950, longitude: -17.4650, tarifHoraire: 300, placesTotal: 60, placesLibres: 27 },
    { id: 5, nom: 'Médina — Allées du Centenaire', description: 'Zone dense à forte affluence', latitude: 14.6810, longitude: -17.4520, tarifHoraire: 300, placesTotal: 110, placesLibres: 9 },
    { id: 6, nom: 'Sacré-Cœur — VDN', description: 'Axe rapide et centres commerciaux', latitude: 14.7080, longitude: -17.4640, tarifHoraire: 400, placesTotal: 70, placesLibres: 41 },
  ];

  private reservations: Reservation[] = [
    { id: 1024, zoneNom: 'Plateau — Place de l\'Indépendance', placeNumero: 'P-A14', dateReservation: '2026-07-12', heureDebut: '09:30', dureeHeures: 2, montantTotal: 1000, statut: 'active', methode: 'wave' },
    { id: 1019, zoneNom: 'Almadies — Route de Ngor', placeNumero: 'A-B07', dateReservation: '2026-07-10', heureDebut: '15:00', dureeHeures: 3, montantTotal: 1200, statut: 'terminee', methode: 'orange_money' },
    { id: 1007, zoneNom: 'Point E — Rue de Kaolack', placeNumero: 'E-C22', dateReservation: '2026-07-08', heureDebut: '11:00', dureeHeures: 1, montantTotal: 300, statut: 'terminee', methode: 'wave' },
    { id: 994, zoneNom: 'Médina — Allées du Centenaire', placeNumero: 'M-D09', dateReservation: '2026-07-05', heureDebut: '18:30', dureeHeures: 2, montantTotal: 600, statut: 'annulee' },
  ];

  getUtilisateur(): Utilisateur { return this.utilisateur; }

  getZones(): ZoneStationnement[] { return this.zones; }

  getZone(id: number): ZoneStationnement | undefined {
    return this.zones.find((z) => z.id === id);
  }

  getReservations(): Reservation[] { return this.reservations; }

  getReservationsActives(): Reservation[] {
    return this.reservations.filter((r) => r.statut === 'active');
  }

  ajouterReservation(r: Reservation): void {
    this.reservations.unshift(r);
  }

  // Statistiques pour le tableau de bord agent
  getStats() {
    const totalPlaces = this.zones.reduce((s, z) => s + z.placesTotal, 0);
    const totalLibres = this.zones.reduce((s, z) => s + z.placesLibres, 0);
    const tauxOccupation = Math.round(((totalPlaces - totalLibres) / totalPlaces) * 100);
    const recettesJour = 842500;
    const reservationsJour = 156;
    return { totalPlaces, totalLibres, tauxOccupation, recettesJour, reservationsJour };
  }

  labelMethode(m: MethodePaiement): string {
    return { wave: 'Wave', orange_money: 'Orange Money', free_money: 'Free Money' }[m];
  }
}
