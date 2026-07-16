import { Injectable, signal } from '@angular/core';

// Service d'authentification simplifié pour la démonstration.
// À connecter à l'API Laravel (endpoints /login, /register, /logout) en production.
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly estConnecte = signal<boolean>(false);
  readonly nomUtilisateur = signal<string>('');

  connecter(identifiant: string): void {
    this.estConnecte.set(true);
    this.nomUtilisateur.set(identifiant || 'Khadim DIAKHATE');
  }

  deconnecter(): void {
    this.estConnecte.set(false);
    this.nomUtilisateur.set('');
  }
}
