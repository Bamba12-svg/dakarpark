import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-mes-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page container">
      <div class="head flex between center">
        <div>
          <h1>Mes réservations</h1>
          <p class="text-muted">Historique de vos stationnements et paiements</p>
        </div>
        <a routerLink="/carte" class="btn btn-primary">+ Nouvelle réservation</a>
      </div>

      <div class="stats-row">
        <div class="stat card"><span class="s-label">Réservations</span><span class="s-val">{{ reservations.length }}</span></div>
        <div class="stat card"><span class="s-label">Actives</span><span class="s-val" style="color:var(--success)">{{ actives }}</span></div>
        <div class="stat card"><span class="s-label">Total dépensé</span><span class="s-val">{{ totalDepense }} FCFA</span></div>
      </div>

      <div class="table card mt-24">
        <div class="t-head">
          <span>Référence</span><span>Zone</span><span>Place</span><span>Date</span>
          <span>Durée</span><span>Montant</span><span>Paiement</span><span>Statut</span>
        </div>
        <div class="t-row" *ngFor="let r of reservations">
          <span class="ref">#{{ r.id }}</span>
          <span class="zone">{{ r.zoneNom }}</span>
          <span><b>{{ r.placeNumero }}</b></span>
          <span>{{ r.dateReservation }}<br><small class="text-muted">{{ r.heureDebut }}</small></span>
          <span>{{ r.dureeHeures }} h</span>
          <span><b>{{ r.montantTotal }} FCFA</b></span>
          <span>
            <span class="pay-tag" *ngIf="r.methode" [class.wave]="r.methode==='wave'"
                  [class.om]="r.methode==='orange_money'" [class.free]="r.methode==='free_money'">
              {{ label(r.methode) }}
            </span>
            <span *ngIf="!r.methode" class="text-muted">—</span>
          </span>
          <span>
            <span class="badge" [class.badge-success]="r.statut==='active'"
                  [class.badge-muted]="r.statut==='terminee'"
                  [class.badge-danger]="r.statut==='annulee'">
              {{ statutLabel(r.statut) }}
            </span>
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 34px 0 60px; }
    h1 { font-size: 28px; font-weight: 800; }
    .head { margin-bottom: 24px; }
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
    .stat { padding: 20px 22px; display: flex; flex-direction: column; gap: 6px; }
    .s-label { font-size: 13.5px; color: var(--muted); }
    .s-val { font-size: 26px; font-weight: 800; color: var(--primary-dark); }
    .table { overflow: hidden; }
    .t-head, .t-row { display: grid; grid-template-columns: 1fr 2fr 0.9fr 1.1fr 0.7fr 1.1fr 1.2fr 1fr; gap: 12px; align-items: center; padding: 15px 22px; }
    .t-head { background: #f4f8f9; font-size: 12.5px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .3px; }
    .t-row { border-top: 1px solid var(--line); font-size: 14px; }
    .t-row:hover { background: #fafcfc; }
    .ref { font-weight: 600; color: var(--primary); }
    .zone { font-size: 13.5px; }
    .pay-tag { font-size: 12px; font-weight: 700; padding: 4px 9px; border-radius: 6px; }
    .pay-tag.wave { background: #e3f7ff; color: #0787b3; }
    .pay-tag.om { background: #ffefe0; color: #d96500; }
    .pay-tag.free { background: #f3f7d8; color: #5a6b00; }
    @media (max-width: 1000px) {
      .stats-row { grid-template-columns: 1fr; }
      .t-head { display: none; }
      .t-row { grid-template-columns: 1fr 1fr; row-gap: 6px; }
    }
  `],
})
export class MesReservationsComponent {
  private data = inject(DataService);
  reservations = this.data.getReservations();
  actives = this.data.getReservationsActives().length;
  totalDepense = this.reservations
    .filter((r) => r.statut !== 'annulee')
    .reduce((s, r) => s + r.montantTotal, 0);

  label(m: any): string { return this.data.labelMethode(m); }
  statutLabel(s: string): string {
    return { active: 'Active', terminee: 'Terminée', annulee: 'Annulée' }[s] ?? s;
  }
}
