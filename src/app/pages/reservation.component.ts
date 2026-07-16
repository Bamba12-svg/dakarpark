import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataService } from '../services/data.service';
import { ZoneStationnement, MethodePaiement, Reservation } from '../models/models';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page container" *ngIf="zone">
      <a routerLink="/carte" class="back">← Retour à la carte</a>

      <div class="grid">
        <!-- FORMULAIRE -->
        <div class="main card">
          <!-- étapes -->
          <div class="steps">
            <div class="step" [class.on]="etape >= 1"><span>1</span> Détails</div>
            <div class="bar" [class.on]="etape >= 2"></div>
            <div class="step" [class.on]="etape >= 2"><span>2</span> Paiement</div>
            <div class="bar" [class.on]="etape >= 3"></div>
            <div class="step" [class.on]="etape >= 3"><span>3</span> Confirmation</div>
          </div>

          <!-- ÉTAPE 1 : détails -->
          <div *ngIf="etape === 1" class="fade-up">
            <h2>Détails de la réservation</h2>
            <div class="zone-banner">
              <span class="zb-ico">📍</span>
              <div>
                <div class="zb-title">{{ zone.nom }}</div>
                <div class="zb-sub text-muted">{{ zone.description }}</div>
              </div>
              <span class="badge badge-success">{{ zone.placesLibres }} libres</span>
            </div>

            <div class="field mt-24">
              <label>Date</label>
              <input type="date" class="input" [(ngModel)]="date">
            </div>
            <div class="row">
              <div class="field">
                <label>Heure d'arrivée</label>
                <input type="time" class="input" [(ngModel)]="heure">
              </div>
              <div class="field">
                <label>Durée</label>
                <select class="input" [(ngModel)]="duree">
                  <option [value]="1">1 heure</option>
                  <option [value]="2">2 heures</option>
                  <option [value]="3">3 heures</option>
                  <option [value]="4">4 heures</option>
                  <option [value]="6">6 heures</option>
                </select>
              </div>
            </div>

            <button class="btn btn-primary btn-block btn-lg mt-16" (click)="etape = 2">
              Continuer vers le paiement →
            </button>
          </div>

          <!-- ÉTAPE 2 : paiement -->
          <div *ngIf="etape === 2" class="fade-up">
            <h2>Choisissez votre moyen de paiement</h2>
            <p class="text-muted">Paiement 100 % sécurisé et instantané</p>

            <div class="pay-methods mt-24">
              <button class="pay-method" [class.sel]="methode === 'wave'" (click)="methode = 'wave'">
                <span class="pm-logo wave">W</span>
                <div class="pm-txt"><b>Wave</b><small>Sans frais</small></div>
                <span class="pm-check">{{ methode === 'wave' ? '●' : '○' }}</span>
              </button>
              <button class="pay-method" [class.sel]="methode === 'orange_money'" (click)="methode = 'orange_money'">
                <span class="pm-logo om">OM</span>
                <div class="pm-txt"><b>Orange Money</b><small>Frais standard</small></div>
                <span class="pm-check">{{ methode === 'orange_money' ? '●' : '○' }}</span>
              </button>
              <button class="pay-method" [class.sel]="methode === 'free_money'" (click)="methode = 'free_money'">
                <span class="pm-logo free">FM</span>
                <div class="pm-txt"><b>Free Money</b><small>Frais standard</small></div>
                <span class="pm-check">{{ methode === 'free_money' ? '●' : '○' }}</span>
              </button>
            </div>

            <div class="field mt-24">
              <label>Numéro {{ labelMethode() }}</label>
              <div class="input-group">
                <span class="icon">📱</span>
                <input class="input" [(ngModel)]="numeroPaiement" placeholder="77 123 45 67">
              </div>
            </div>

            <div class="flex gap-12 mt-16">
              <button class="btn btn-ghost" (click)="etape = 1">← Retour</button>
              <button class="btn btn-accent btn-block" (click)="payer()" [disabled]="enCours">
                {{ enCours ? 'Traitement en cours…' : 'Payer ' + total() + ' FCFA' }}
              </button>
            </div>

            <div class="secure mt-16">🔒 Vos informations de paiement sont chiffrées et sécurisées</div>
          </div>

          <!-- ÉTAPE 3 : confirmation -->
          <div *ngIf="etape === 3" class="fade-up confirm">
            <div class="check-anim">✓</div>
            <h2>Réservation confirmée !</h2>
            <p class="text-muted">Votre place vous attend. Un reçu a été envoyé par SMS.</p>

            <div class="ticket">
              <div class="tk-row"><span>Référence</span><b>{{ reference }}</b></div>
              <div class="tk-row"><span>Zone</span><b>{{ zone.nom }}</b></div>
              <div class="tk-row"><span>Place</span><b>{{ placeNumero }}</b></div>
              <div class="tk-row"><span>Date & heure</span><b>{{ date }} à {{ heure }}</b></div>
              <div class="tk-row"><span>Durée</span><b>{{ duree }} h</b></div>
              <div class="tk-row"><span>Paiement</span><b>{{ labelMethode() }}</b></div>
              <div class="tk-sep"></div>
              <div class="tk-row total"><span>Total payé</span><b>{{ total() }} FCFA</b></div>
            </div>

            <div class="flex gap-12 mt-24">
              <a routerLink="/mes-reservations" class="btn btn-primary btn-block">Voir mes réservations</a>
              <a routerLink="/carte" class="btn btn-ghost">Nouvelle réservation</a>
            </div>
          </div>
        </div>

        <!-- RÉCAPITULATIF -->
        <aside class="side card" *ngIf="etape < 3">
          <h3>Récapitulatif</h3>
          <div class="recap-zone">
            <div class="rz-title">{{ zone.nom }}</div>
            <div class="rz-sub text-muted">Place attribuée : {{ placeNumero }}</div>
          </div>
          <div class="recap-line"><span>Tarif horaire</span><b>{{ zone.tarifHoraire }} FCFA</b></div>
          <div class="recap-line"><span>Durée</span><b>{{ duree }} h</b></div>
          <div class="recap-line"><span>Frais de service</span><b>0 FCFA</b></div>
          <div class="recap-sep"></div>
          <div class="recap-line total"><span>Total</span><b>{{ total() }} FCFA</b></div>
          <div class="eco mt-16">
            <span>🌱</span> En réservant, vous évitez en moyenne <b>18 min</b> de recherche.
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 26px 0 60px; }
    .back { color: var(--muted); font-size: 14.5px; font-weight: 500; display: inline-block; margin-bottom: 18px; }
    .back:hover { color: var(--primary); }
    .grid { display: grid; grid-template-columns: 1fr 360px; gap: 22px; align-items: start; }
    .main { padding: 30px 32px; }
    h2 { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
    /* steps */
    .steps { display: flex; align-items: center; margin-bottom: 30px; }
    .step { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--muted); }
    .step span { width: 28px; height: 28px; border-radius: 50%; background: #eef3f4; display: grid; place-items: center; font-size: 13px; }
    .step.on { color: var(--primary-dark); }
    .step.on span { background: var(--primary); color: #fff; }
    .bar { flex: 1; height: 2px; background: #eef3f4; margin: 0 10px; }
    .bar.on { background: var(--primary); }
    /* zone banner */
    .zone-banner { display: flex; align-items: center; gap: 14px; background: #f0f8f9; border: 1px solid var(--line); border-radius: 12px; padding: 16px; }
    .zb-ico { font-size: 24px; }
    .zb-title { font-weight: 700; }
    .zb-sub { font-size: 13px; }
    .zone-banner .badge { margin-left: auto; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    /* pay methods */
    .pay-methods { display: flex; flex-direction: column; gap: 12px; }
    .pay-method { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1.5px solid var(--line); border-radius: 12px; background: #fff; transition: border .2s, box-shadow .2s; text-align: left; }
    .pay-method:hover { border-color: var(--primary-light); }
    .pay-method.sel { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(14,107,117,.1); }
    .pm-logo { width: 46px; height: 46px; border-radius: 10px; display: grid; place-items: center; font-weight: 800; font-size: 16px; color: #fff; }
    .pm-logo.wave { background: #1dc4ff; color: #002; }
    .pm-logo.om { background: #ff7900; }
    .pm-logo.free { background: #cddc39; color: #1a2400; }
    .pm-txt { display: flex; flex-direction: column; }
    .pm-txt b { font-size: 15.5px; }
    .pm-txt small { font-size: 12.5px; color: var(--muted); }
    .pm-check { margin-left: auto; color: var(--primary); font-size: 20px; }
    .secure { text-align: center; font-size: 13px; color: var(--muted); }
    /* confirmation */
    .confirm { text-align: center; padding: 10px 0; }
    .check-anim { width: 76px; height: 76px; border-radius: 50%; background: var(--success-light); color: var(--success); font-size: 40px; display: grid; place-items: center; margin: 0 auto 18px; }
    .ticket { background: #f8fafb; border: 1px dashed var(--line); border-radius: 14px; padding: 22px; text-align: left; margin-top: 20px; max-width: 420px; margin-left: auto; margin-right: auto; }
    .tk-row { display: flex; justify-content: space-between; padding: 7px 0; font-size: 14.5px; }
    .tk-row span { color: var(--muted); }
    .tk-sep { border-top: 1px dashed var(--line); margin: 10px 0; }
    .tk-row.total { font-size: 17px; }
    .tk-row.total b { color: var(--primary-dark); }
    /* side */
    .side { padding: 24px; position: sticky; top: 88px; }
    .side h3 { font-size: 17px; font-weight: 700; margin-bottom: 16px; }
    .recap-zone { background: #f0f8f9; border-radius: 10px; padding: 14px; margin-bottom: 16px; }
    .rz-title { font-weight: 700; font-size: 14.5px; }
    .rz-sub { font-size: 12.5px; margin-top: 3px; }
    .recap-line { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14.5px; }
    .recap-line span { color: var(--muted); }
    .recap-sep { border-top: 1px solid var(--line); margin: 8px 0; }
    .recap-line.total { font-size: 18px; }
    .recap-line.total b { color: var(--primary-dark); }
    .eco { background: var(--success-light); color: #146c3a; border-radius: 10px; padding: 12px; font-size: 13px; line-height: 1.5; }
    @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } .side { position: static; } }
  `],
})
export class ReservationComponent {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);
  private router = inject(Router);

  zone?: ZoneStationnement;
  etape = 1;
  date = new Date().toISOString().slice(0, 10);
  heure = '09:30';
  duree = 2;
  methode: MethodePaiement = 'wave';
  numeroPaiement = '';
  enCours = false;
  reference = '';
  placeNumero = '';

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('zoneId'));
    this.zone = this.data.getZone(id) ?? this.data.getZones()[0];
    // Attribution d'un numéro de place fictif
    const prefixe = (this.zone?.nom.charAt(0) ?? 'P').toUpperCase();
    this.placeNumero = `${prefixe}-${String.fromCharCode(65 + Math.floor(Math.random() * 6))}${Math.floor(Math.random() * 40) + 1}`;
  }

  labelMethode(): string {
    return this.data.labelMethode(this.methode);
  }

  total(): number {
    return (this.zone?.tarifHoraire ?? 0) * this.duree;
  }

  payer(): void {
    this.enCours = true;
    // Simulation d'appel à l'API de paiement (Wave / Orange Money)
    setTimeout(() => {
      this.enCours = false;
      this.reference = 'DKP-' + Math.floor(100000 + Math.random() * 899999);
      const r: Reservation = {
        id: Math.floor(1000 + Math.random() * 8999),
        zoneNom: this.zone!.nom,
        placeNumero: this.placeNumero,
        dateReservation: this.date,
        heureDebut: this.heure,
        dureeHeures: this.duree,
        montantTotal: this.total(),
        statut: 'active',
        methode: this.methode,
      };
      this.data.ajouterReservation(r);
      this.etape = 3;
    }, 1600);
  }
}
