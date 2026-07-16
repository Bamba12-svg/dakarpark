import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-wrap">
      <div class="auth-visual">
        <div class="av-inner">
          <span class="logo">P</span>
          <h2>Bon retour parmi nous</h2>
          <p>Connectez-vous pour retrouver vos réservations et vous garer en toute sérénité à Dakar.</p>
          <ul class="perks">
            <li>✓ Places géolocalisées en temps réel</li>
            <li>✓ Paiement Wave & Orange Money</li>
            <li>✓ Historique de vos stationnements</li>
          </ul>
        </div>
      </div>

      <div class="auth-form">
        <div class="form-box fade-up">
          <h1>Connexion</h1>
          <p class="text-muted">Accédez à votre espace DakarPark</p>

          <form (ngSubmit)="seConnecter()" class="mt-24">
            <div class="field">
              <label>Numéro de téléphone ou e-mail</label>
              <div class="input-group">
                <span class="icon">📱</span>
                <input class="input" [(ngModel)]="identifiant" name="identifiant"
                       placeholder="77 123 45 67" required>
              </div>
            </div>

            <div class="field">
              <label>Mot de passe</label>
              <div class="input-group">
                <span class="icon">🔒</span>
                <input class="input" [type]="voirMdp ? 'text' : 'password'"
                       [(ngModel)]="motDePasse" name="motDePasse"
                       placeholder="••••••••" required>
                <button type="button" class="toggle" (click)="voirMdp = !voirMdp">
                  {{ voirMdp ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <div class="flex between center">
              <label class="check"><input type="checkbox"> Se souvenir de moi</label>
              <a href="#" class="link">Mot de passe oublié ?</a>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg mt-24">Se connecter</button>
          </form>

          <div class="sep"><span>ou</span></div>

          <p class="text-center">Pas encore de compte ?
            <a routerLink="/inscription" class="link"><b>Créer un compte</b></a>
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
    .perks { list-style: none; margin-top: 30px; display: flex; flex-direction: column; gap: 14px; }
    .perks li { font-size: 15px; color: rgba(255,255,255,.95); }
    .auth-form { display: flex; align-items: center; justify-content: center; padding: 40px; }
    .form-box { width: 100%; max-width: 400px; }
    .form-box h1 { font-size: 30px; font-weight: 800; }
    .toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; font-size: 17px; }
    .check { font-size: 13.5px; color: var(--muted); display: flex; align-items: center; gap: 7px; }
    .link { color: var(--primary); font-size: 13.5px; }
    .sep { text-align: center; margin: 24px 0; position: relative; }
    .sep::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: var(--line); }
    .sep span { background: var(--bg); padding: 0 14px; position: relative; color: var(--muted); font-size: 13px; }
    .text-center { text-align: center; font-size: 14.5px; }
    @media (max-width: 900px) { .auth-wrap { grid-template-columns: 1fr; } .auth-visual { display: none; } }
  `],
})
export class ConnexionComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  identifiant = '';
  motDePasse = '';
  voirMdp = false;

  seConnecter(): void {
    this.auth.connecter('Khadim DIAKHATE');
    this.router.navigate(['/carte']);
  }
}
