import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="auth-visual">
        <div class="av-inner">
          <span class="logo">P</span>
          <h2>Rejoignez DakarPark</h2>
          <p>Créez votre compte en 30 secondes et dites adieu au stress du stationnement dans la capitale.</p>
          <div class="stat-box">
            <div><b>18 min</b><span>de recherche évitées en moyenne</span></div>
            <div><b>6 zones</b><span>couvertes à Dakar</span></div>
          </div>
        </div>
      </div>

      <div class="auth-form">
        <div class="form-box fade-up">
          <h1>Créer un compte</h1>
          <p class="text-muted">Renseignez vos informations pour commencer</p>

          <form (ngSubmit)="sInscrire()" class="mt-24">
            <div class="row">
              <div class="field">
                <label>Prénom</label>
                <input class="input" [(ngModel)]="prenom" name="prenom" placeholder="Khadim" required>
              </div>
              <div class="field">
                <label>Nom</label>
                <input class="input" [(ngModel)]="nom" name="nom" placeholder="Diakhaté" required>
              </div>
            </div>

            <div class="field">
              <label>Numéro de téléphone</label>
              <div class="input-group">
                <span class="icon">📱</span>
                <input class="input" [(ngModel)]="telephone" name="telephone" placeholder="77 123 45 67" required>
              </div>
            </div>

            <div class="field">
              <label>Adresse e-mail</label>
              <div class="input-group">
                <span class="icon">✉️</span>
                <input class="input" type="email" [(ngModel)]="email" name="email" placeholder="vous@email.sn" required>
              </div>
            </div>

            <div class="field">
              <label>Numéro d'immatriculation du véhicule</label>
              <div class="input-group">
                <span class="icon">🚗</span>
                <input class="input" [(ngModel)]="immat" name="immat" placeholder="DK-1234-AB">
              </div>
            </div>

            <div class="field">
              <label>Mot de passe</label>
              <div class="input-group">
                <span class="icon">🔒</span>
                <input class="input" [type]="voirMdp ? 'text' : 'password'" [(ngModel)]="motDePasse" name="motDePasse" placeholder="••••••••" required>
                <button type="button" class="toggle" (click)="voirMdp = !voirMdp">{{ voirMdp ? '🙈' : '👁️' }}</button>
              </div>
            </div>

            <label class="check"><input type="checkbox" required> J'accepte les conditions d'utilisation</label>

            <button type="submit" class="btn btn-primary btn-block btn-lg mt-24">Créer mon compte</button>
          </form>

          <p class="text-center mt-16">Déjà inscrit ?
            <a routerLink="/connexion" class="link"><b>Se connecter</b></a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrap { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 68px); }
    .auth-visual { background: linear-gradient(150deg, var(--primary-dark), var(--primary) 70%, var(--primary-light)); color: #fff; display: flex; align-items: center; padding: 60px; }
    .av-inner { max-width: 400px; }
    .logo { width: 54px; height: 54px; border-radius: 14px; background: rgba(255,255,255,.15); display: grid; place-items: center; font-size: 28px; font-weight: 800; margin-bottom: 28px; }
    .auth-visual h2 { font-size: 32px; font-weight: 800; line-height: 1.2; }
    .auth-visual p { font-size: 16px; color: rgba(255,255,255,.85); margin-top: 14px; line-height: 1.6; }
    .stat-box { margin-top: 34px; display: flex; flex-direction: column; gap: 20px; }
    .stat-box b { font-size: 24px; display: block; }
    .stat-box span { font-size: 14px; color: rgba(255,255,255,.8); }
    .auth-form { display: flex; align-items: center; justify-content: center; padding: 40px; }
    .form-box { width: 100%; max-width: 420px; }
    .form-box h1 { font-size: 30px; font-weight: 800; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; font-size: 17px; }
    .check { font-size: 13.5px; color: var(--muted); display: flex; align-items: center; gap: 7px; margin-top: 4px; }
    .link { color: var(--primary); }
    .text-center { text-align: center; font-size: 14.5px; }
    @media (max-width: 900px) { .auth-wrap { grid-template-columns: 1fr; } .auth-visual { display: none; } }
  `],
})
export class InscriptionComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  prenom = ''; nom = ''; telephone = ''; email = ''; immat = ''; motDePasse = '';
  voirMdp = false;

  sInscrire(): void {
    this.auth.connecter(`${this.prenom} ${this.nom}`.trim() || 'Khadim DIAKHATE');
    this.router.navigate(['/carte']);
  }
}
