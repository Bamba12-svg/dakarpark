import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="nav">
      <div class="container flex center between">
        <a routerLink="/" class="brand">
          <span class="logo">P</span>
          <span class="brand-text">Dakar<b>Park</b></span>
        </a>

        <nav class="links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Accueil</a>
          <a routerLink="/carte" routerLinkActive="active">Trouver une place</a>
          <a routerLink="/mes-reservations" routerLinkActive="active">Mes réservations</a>
          <a routerLink="/agent" routerLinkActive="active">Espace agent</a>
        </nav>

        <div class="flex center gap-12">
          <ng-container *ngIf="!auth.estConnecte()">
            <a routerLink="/connexion" class="btn btn-ghost">Connexion</a>
            <a routerLink="/inscription" class="btn btn-primary">S'inscrire</a>
          </ng-container>
          <ng-container *ngIf="auth.estConnecte()">
            <div class="user">
              <span class="avatar">{{ initiales() }}</span>
              <span class="uname">{{ auth.nomUtilisateur() }}</span>
            </div>
            <button class="btn btn-ghost" (click)="deconnexion()">Déconnexion</button>
          </ng-container>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,.92); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); height: 68px; display: flex; align-items: center; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .logo { width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, var(--primary), var(--primary-light)); color: #fff; font-weight: 800; display: grid; place-items: center; font-size: 20px; }
    .brand-text { font-size: 20px; font-weight: 700; color: var(--primary-dark); }
    .brand-text b { color: var(--accent); }
    .links { display: flex; gap: 26px; }
    .links a { font-size: 15px; font-weight: 500; color: var(--muted); padding: 6px 0; border-bottom: 2px solid transparent; transition: color .2s; }
    .links a:hover { color: var(--primary); }
    .links a.active { color: var(--primary-dark); border-bottom-color: var(--primary); font-weight: 600; }
    .user { display: flex; align-items: center; gap: 9px; }
    .avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--primary); color: #fff; display: grid; place-items: center; font-size: 13px; font-weight: 700; }
    .uname { font-size: 14.5px; font-weight: 600; }
    @media (max-width: 900px) { .links { display: none; } }
  `],
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  initiales(): string {
    const n = this.auth.nomUtilisateur();
    return n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || 'KD';
  }

  deconnexion(): void {
    this.auth.deconnecter();
    this.router.navigate(['/']);
  }
}
