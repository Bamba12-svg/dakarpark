import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-dashboard-agent',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page container">
      <div class="head">
        <div>
          <span class="tag">Espace agent municipal</span>
          <h1>Tableau de bord — Ville de Dakar</h1>
          <p class="text-muted">Vue d'ensemble du stationnement · {{ aujourdhui }}</p>
        </div>
        <div class="agent">
          <span class="ag-avatar">AM</span>
          <div><b>Agent municipal</b><small class="text-muted">Zone Plateau</small></div>
        </div>
      </div>

      <!-- KPIs -->
      <div class="kpis">
        <div class="kpi card">
          <div class="kpi-ico" style="background:#e7f5f7;color:#0e6b75">🅿️</div>
          <div><div class="kpi-val">{{ stats.totalPlaces }}</div><div class="kpi-lab">Places gérées</div></div>
        </div>
        <div class="kpi card">
          <div class="kpi-ico" style="background:#e6f6ec;color:#1f9d55">✅</div>
          <div><div class="kpi-val">{{ stats.totalLibres }}</div><div class="kpi-lab">Places libres</div></div>
        </div>
        <div class="kpi card">
          <div class="kpi-ico" style="background:#fbeaea;color:#d64545">📊</div>
          <div><div class="kpi-val">{{ stats.tauxOccupation }}%</div><div class="kpi-lab">Taux d'occupation</div></div>
        </div>
        <div class="kpi card">
          <div class="kpi-ico" style="background:#fff3e0;color:#f4a340">💰</div>
          <div><div class="kpi-val">{{ formatMontant(stats.recettesJour) }}</div><div class="kpi-lab">Recettes du jour (FCFA)</div></div>
        </div>
      </div>

      <div class="grid mt-24">
        <!-- Occupation par zone -->
        <div class="card panel">
          <div class="panel-head flex between center">
            <h3>Occupation par zone</h3>
            <span class="text-muted" style="font-size:13px">Temps réel</span>
          </div>
          <div class="zone-row" *ngFor="let z of zones">
            <div class="zr-info">
              <span class="zr-name">{{ z.nom }}</span>
              <span class="zr-count text-muted">{{ z.placesTotal - z.placesLibres }} / {{ z.placesTotal }} occupées</span>
            </div>
            <div class="bar-wrap">
              <div class="bar-fill" [style.width.%]="tauxZone(z)"
                   [class.high]="tauxZone(z) > 85" [class.mid]="tauxZone(z) > 60 && tauxZone(z) <= 85"></div>
            </div>
            <span class="zr-pct">{{ tauxZone(z) }}%</span>
          </div>
        </div>

        <!-- Réservations actives -->
        <div class="card panel">
          <div class="panel-head flex between center">
            <h3>Réservations actives</h3>
            <span class="badge badge-success">{{ actives.length }} en cours</span>
          </div>
          <div class="resa" *ngFor="let r of actives">
            <span class="r-place">{{ r.placeNumero }}</span>
            <div class="r-info">
              <div class="r-zone">{{ r.zoneNom }}</div>
              <div class="r-time text-muted">Depuis {{ r.heureDebut }} · {{ r.dureeHeures }} h</div>
            </div>
            <span class="r-amount">{{ r.montantTotal }} FCFA</span>
            <button class="r-check" title="Contrôler">✓</button>
          </div>
          <div *ngIf="actives.length === 0" class="empty text-muted">Aucune réservation active pour le moment.</div>

          <button class="btn btn-ghost btn-block mt-16">Signaler une infraction</button>
        </div>
      </div>

      <!-- Recettes par moyen de paiement -->
      <div class="card panel mt-24">
        <h3>Répartition des recettes par moyen de paiement</h3>
        <div class="pay-split mt-16">
          <div class="split-bar">
            <div class="sb-seg wave" style="width:52%"><span>Wave 52%</span></div>
            <div class="sb-seg om" style="width:34%"><span>Orange Money 34%</span></div>
            <div class="sb-seg free" style="width:14%"><span>Free 14%</span></div>
          </div>
        </div>
        <div class="split-legend mt-16">
          <span><i class="lg wave"></i> Wave — 438 100 FCFA</span>
          <span><i class="lg om"></i> Orange Money — 286 450 FCFA</span>
          <span><i class="lg free"></i> Free Money — 117 950 FCFA</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 22px 0 40px; }
    .head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .tag { display: inline-block; background: #e7f5f7; color: var(--primary-dark); font-weight: 700; font-size: 12.5px; padding: 5px 12px; border-radius: 999px; margin-bottom: 8px; }
    h1 { font-size: 25px; font-weight: 800; }
    .agent { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 10px 16px; box-shadow: var(--shadow); }
    .ag-avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--primary); color: #fff; display: grid; place-items: center; font-weight: 700; }
    .agent b { font-size: 14px; display: block; }
    .agent small { font-size: 12.5px; }
    /* KPIs */
    .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .kpi { padding: 18px; display: flex; align-items: center; gap: 14px; }
    .kpi-ico { width: 48px; height: 48px; border-radius: 13px; display: grid; place-items: center; font-size: 22px; }
    .kpi-val { font-size: 24px; font-weight: 800; color: var(--ink); line-height: 1; }
    .kpi-lab { font-size: 12.5px; color: var(--muted); margin-top: 5px; }
    /* grid */
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .panel { padding: 20px; }
    .panel-head { margin-bottom: 14px; }
    .panel h3 { font-size: 16px; font-weight: 700; }
    /* zone occupation */
    .zone-row { display: grid; grid-template-columns: 1.4fr 2fr auto; gap: 14px; align-items: center; padding: 9px 0; }
    .zr-info { display: flex; flex-direction: column; }
    .zr-name { font-size: 14px; font-weight: 600; }
    .zr-count { font-size: 12px; margin-top: 2px; }
    .bar-wrap { height: 9px; background: #eef3f4; border-radius: 999px; overflow: hidden; }
    .bar-fill { height: 100%; background: var(--success); border-radius: 999px; transition: width .5s; }
    .bar-fill.mid { background: var(--warning); }
    .bar-fill.high { background: var(--danger); }
    .zr-pct { font-size: 13.5px; font-weight: 700; color: var(--muted); min-width: 38px; text-align: right; }
    /* resa */
    .resa { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--line); }
    .resa:last-of-type { border-bottom: none; }
    .r-place { width: 52px; height: 40px; background: #f0f8f9; border-radius: 8px; display: grid; place-items: center; font-weight: 800; font-size: 13px; color: var(--primary-dark); }
    .r-info { flex: 1; }
    .r-zone { font-size: 14px; font-weight: 600; }
    .r-time { font-size: 12.5px; margin-top: 2px; }
    .r-amount { font-weight: 700; font-size: 14px; }
    .r-check { width: 32px; height: 32px; border-radius: 8px; background: var(--success-light); color: var(--success); font-weight: 800; }
    .empty { text-align: center; padding: 20px; font-size: 14px; }
    /* pay split */
    .split-bar { display: flex; height: 40px; border-radius: 10px; overflow: hidden; }
    .sb-seg { display: grid; place-items: center; color: #fff; font-size: 12.5px; font-weight: 700; }
    .sb-seg.wave { background: #1dc4ff; color: #002; }
    .sb-seg.om { background: #ff7900; }
    .sb-seg.free { background: #cddc39; color: #1a2400; }
    .split-legend { display: flex; gap: 22px; flex-wrap: wrap; font-size: 13.5px; color: var(--muted); }
    .split-legend i { display: inline-block; width: 11px; height: 11px; border-radius: 3px; margin-right: 6px; }
    .lg.wave { background: #1dc4ff; } .lg.om { background: #ff7900; } .lg.free { background: #cddc39; }
    @media (max-width: 1000px) { .kpis, .grid { grid-template-columns: 1fr; } .head { flex-direction: column; gap: 16px; } }
  `],
})
export class DashboardAgentComponent {
  private data = inject(DataService);
  zones = this.data.getZones();
  stats = this.data.getStats();
  actives = this.data.getReservationsActives();
  aujourdhui = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  tauxZone(z: any): number {
    return Math.round(((z.placesTotal - z.placesLibres) / z.placesTotal) * 100);
  }
  formatMontant(n: number): string {
    return n.toLocaleString('fr-FR');
  }
}
