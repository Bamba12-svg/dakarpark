import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService } from '../services/data.service';
import { ZoneStationnement } from '../models/models';

@Component({
  selector: 'app-carte',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="container">
        <div class="head">
          <div>
            <h1>Trouver une place</h1>
            <p class="text-muted">Places de stationnement disponibles autour de vous, en temps réel</p>
          </div>
          <div class="search input-group">
            <span class="icon">🔍</span>
            <input class="input" [(ngModel)]="recherche" placeholder="Rechercher une zone (Plateau, Almadies…)">
          </div>
        </div>

        <div class="layout">
          <!-- LISTE -->
          <aside class="list">
            <div class="list-head flex between center">
              <span><b>{{ zonesFiltrees().length }}</b> zones trouvées</span>
              <select class="mini-select" [(ngModel)]="tri">
                <option value="dispo">Plus de places</option>
                <option value="prix">Prix croissant</option>
              </select>
            </div>

            <div class="zone-item card" *ngFor="let z of zonesFiltrees()"
                 [class.sel]="z.id === zoneActive?.id" (click)="zoneActive = z">
              <div class="flex between center">
                <h4>{{ z.nom }}</h4>
                <span class="badge" [class.badge-success]="z.placesLibres > 10"
                      [class.badge-danger]="z.placesLibres <= 10">
                  {{ z.placesLibres }} / {{ z.placesTotal }}
                </span>
              </div>
              <p class="text-muted zi-desc">{{ z.description }}</p>
              <div class="flex between center mt-8">
                <span class="tarif">{{ z.tarifHoraire }} FCFA<small>/h</small></span>
                <a [routerLink]="['/reservation', z.id]" class="btn btn-primary btn-sm">Réserver</a>
              </div>
            </div>
          </aside>

          <!-- CARTE -->
          <div class="map card">
            <div class="map-grid">
              <!-- rues -->
              <svg class="streets" viewBox="0 0 600 500" preserveAspectRatio="none">
                <path d="M0,120 L600,140" /><path d="M0,260 L600,250" /><path d="M0,390 L600,400" />
                <path d="M120,0 L110,500" /><path d="M300,0 L310,500" /><path d="M470,0 L460,500" />
              </svg>

              <!-- pins des zones -->
              <button class="mappin" *ngFor="let z of zonesFiltrees()"
                      [style.left.%]="pinX(z)" [style.top.%]="pinY(z)"
                      [class.free]="z.placesLibres > 10" [class.full]="z.placesLibres <= 10"
                      [class.active]="z.id === zoneActive?.id"
                      (click)="zoneActive = z"
                      [title]="z.nom">
                <span class="dot"></span>
                <span class="count">{{ z.placesLibres }}</span>
              </button>

              <!-- position utilisateur -->
              <div class="me" title="Vous êtes ici">
                <span class="me-dot"></span><span class="me-ring"></span>
              </div>
            </div>

            <!-- popup zone active -->
            <div class="popup" *ngIf="zoneActive">
              <div class="flex between center">
                <div>
                  <div class="pp-title">{{ zoneActive.nom }}</div>
                  <div class="pp-sub">{{ zoneActive.description }}</div>
                </div>
                <span class="badge" [class.badge-success]="zoneActive.placesLibres > 10"
                      [class.badge-danger]="zoneActive.placesLibres <= 10">
                  {{ zoneActive.placesLibres }} places libres
                </span>
              </div>
              <div class="flex between center mt-16">
                <span class="pp-price">{{ zoneActive.tarifHoraire }} FCFA<small>/heure</small></span>
                <a [routerLink]="['/reservation', zoneActive.id]" class="btn btn-accent">Réserver cette zone →</a>
              </div>
            </div>

            <!-- légende -->
            <div class="legend">
              <span><i class="lg free"></i> Disponible</span>
              <span><i class="lg full"></i> Presque plein</span>
              <span><i class="lg me-lg"></i> Votre position</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 24px 0 40px; }
    h1 { font-size: 26px; font-weight: 800; }
    .head { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin-bottom: 18px; }
    .search { min-width: 340px; }
    .layout { display: grid; grid-template-columns: 360px 1fr; gap: 20px; }
    /* liste */
    .list { display: flex; flex-direction: column; gap: 12px; max-height: 520px; overflow-y: auto; padding-right: 4px; }
    .list-head { font-size: 14px; color: var(--muted); padding: 2px 4px; }
    .mini-select { border: 1px solid var(--line); border-radius: 8px; padding: 6px 10px; font-size: 13px; color: var(--ink); background: #fff; }
    .zone-item { padding: 16px; cursor: pointer; transition: border .2s, transform .1s; border: 1.5px solid var(--line); }
    .zone-item:hover { transform: translateY(-2px); }
    .zone-item.sel { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(14,107,117,.1); }
    .zone-item h4 { font-size: 15px; font-weight: 700; max-width: 62%; }
    .zi-desc { font-size: 13px; margin-top: 5px; }
    .tarif { font-weight: 800; color: var(--primary-dark); font-size: 16px; }
    .tarif small, .pp-price small { font-size: 12px; color: var(--muted); font-weight: 500; }
    .btn-sm { padding: 8px 14px; font-size: 13.5px; }
    /* carte */
    .map { position: relative; overflow: hidden; min-height: 520px; }
    .map-grid { position: absolute; inset: 0; background:
      linear-gradient(0deg, rgba(14,107,117,.04), rgba(14,107,117,.04)),
      repeating-linear-gradient(0deg, #e8f1f2 0 1px, transparent 1px 46px),
      repeating-linear-gradient(90deg, #e8f1f2 0 1px, transparent 1px 46px), #f0f7f8; }
    .streets { position: absolute; inset: 0; width: 100%; height: 100%; }
    .streets path { stroke: #d4e6e8; stroke-width: 14; fill: none; }
    .mappin { position: absolute; transform: translate(-50%, -100%); background: none; display: flex; flex-direction: column; align-items: center; }
    .mappin .dot { width: 30px; height: 30px; border-radius: 50% 50% 50% 2px; transform: rotate(45deg); box-shadow: 0 4px 10px rgba(0,0,0,.2); display: grid; place-items: center; }
    .mappin.free .dot { background: var(--success); }
    .mappin.full .dot { background: var(--danger); }
    .mappin .count { position: absolute; top: 4px; color: #fff; font-size: 12px; font-weight: 800; transform: rotate(0); }
    .mappin.active .dot { outline: 4px solid rgba(244,163,64,.5); transform: rotate(45deg) scale(1.15); }
    .mappin:hover { z-index: 5; }
    .me { position: absolute; left: 46%; top: 68%; transform: translate(-50%,-50%); }
    .me-dot { position: absolute; width: 16px; height: 16px; background: #2b7fff; border: 3px solid #fff; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,.3); z-index: 2; }
    .me-ring { position: absolute; width: 44px; height: 44px; left: -14px; top: -14px; border-radius: 50%; background: rgba(43,127,255,.18); animation: pulse 2s infinite; }
    @keyframes pulse { 0% { transform: scale(.6); opacity: .8; } 100% { transform: scale(1.4); opacity: 0; } }
    /* popup */
    .popup { position: absolute; left: 22px; right: 22px; bottom: 22px; background: #fff; border-radius: 14px; box-shadow: var(--shadow-lg); padding: 18px 20px; border: 1px solid var(--line); }
    .pp-title { font-weight: 700; font-size: 16px; }
    .pp-sub { font-size: 13px; color: var(--muted); margin-top: 3px; }
    .pp-price { font-size: 22px; font-weight: 800; color: var(--primary-dark); }
    /* legend */
    .legend { position: absolute; top: 16px; right: 16px; background: #fff; border-radius: 10px; box-shadow: var(--shadow); padding: 10px 14px; display: flex; flex-direction: column; gap: 7px; font-size: 12.5px; color: var(--muted); border: 1px solid var(--line); }
    .legend i { display: inline-block; width: 11px; height: 11px; border-radius: 50%; margin-right: 6px; vertical-align: middle; }
    .lg.free { background: var(--success); } .lg.full { background: var(--danger); } .lg.me-lg { background: #2b7fff; }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } .head { flex-direction: column; align-items: stretch; } .search { min-width: 0; } }
  `],
})
export class CarteComponent {
  private data = inject(DataService);
  zones = this.data.getZones();
  recherche = '';
  tri: 'dispo' | 'prix' = 'dispo';
  zoneActive: ZoneStationnement | null = this.zones[0] ?? null;

  zonesFiltrees(): ZoneStationnement[] {
    let list = this.zones.filter((z) =>
      z.nom.toLowerCase().includes(this.recherche.toLowerCase()) ||
      z.description.toLowerCase().includes(this.recherche.toLowerCase()));
    list = [...list].sort((a, b) =>
      this.tri === 'dispo' ? b.placesLibres - a.placesLibres : a.tarifHoraire - b.tarifHoraire);
    return list;
  }

  // Position simulée des pins sur la carte (répartition visuelle)
  pinX(z: ZoneStationnement): number {
    const map: Record<number, number> = { 1: 25, 2: 72, 3: 40, 4: 60, 5: 33, 6: 82 };
    return map[z.id] ?? 50;
  }
  pinY(z: ZoneStationnement): number {
    const map: Record<number, number> = { 1: 30, 2: 22, 3: 52, 4: 44, 5: 72, 6: 60 };
    return map[z.id] ?? 50;
  }
}
