import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- HERO -->
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-text fade-up">
          <span class="pill">🅿️ Stationnement intelligent · Ville de Dakar</span>
          <h1>Trouvez, réservez et payez votre place de stationnement en quelques secondes</h1>
          <p>Fini l'errance dans le Plateau à la recherche d'une place. DakarPark vous géolocalise
             les places libres en temps réel et vous permet de payer directement avec Wave ou Orange Money.</p>
          <div class="flex gap-12 mt-24">
            <a routerLink="/carte" class="btn btn-primary btn-lg">Trouver une place</a>
            <a routerLink="/inscription" class="btn btn-ghost btn-lg">Créer un compte</a>
          </div>
          <div class="trust mt-32">
            <div><b>{{ stats.totalPlaces }}</b><span>places gérées</span></div>
            <div><b>6</b><span>zones à Dakar</span></div>
            <div><b>3</b><span>moyens de paiement</span></div>
          </div>
        </div>

        <div class="hero-card fade-up">
          <div class="map-mini">
            <div class="pin pin-1">🟢</div>
            <div class="pin pin-2">🟢</div>
            <div class="pin pin-3">🔴</div>
            <div class="pin pin-4">🟢</div>
            <div class="route"></div>
            <div class="car">🚗</div>
          </div>
          <div class="mini-card">
            <div class="flex between center">
              <div>
                <div class="mc-title">Place P-A14 disponible</div>
                <div class="mc-sub">Plateau · à 120 m de vous</div>
              </div>
              <span class="badge badge-success">Libre</span>
            </div>
            <div class="flex between center mt-16">
              <span class="price">500 FCFA<small>/heure</small></span>
              <span class="btn btn-accent">Réserver</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FONCTIONNALITÉS -->
    <section class="features container">
      <h2>Comment ça marche ?</h2>
      <p class="text-muted sub">Trois étapes suffisent pour se garer sereinement</p>
      <div class="feat-grid">
        <div class="feat card">
          <div class="feat-ico" style="background:#e6f6ec;color:#1f9d55">📍</div>
          <h3>1. Localisez</h3>
          <p>Visualisez sur la carte toutes les places libres autour de vous, mises à jour en temps réel.</p>
        </div>
        <div class="feat card">
          <div class="feat-ico" style="background:#e7f5f7;color:#0e6b75">🎫</div>
          <h3>2. Réservez</h3>
          <p>Sélectionnez une place, choisissez votre durée et réservez avant même d'arriver.</p>
        </div>
        <div class="feat card">
          <div class="feat-ico" style="background:#fff3e0;color:#f4a340">📱</div>
          <h3>3. Payez</h3>
          <p>Réglez en un instant avec Wave, Orange Money ou Free Money. Reçu instantané.</p>
        </div>
      </div>
    </section>

    <!-- ZONES -->
    <section class="zones container">
      <div class="flex between center">
        <div>
          <h2>Zones couvertes à Dakar</h2>
          <p class="text-muted">Les principaux pôles à forte densité automobile</p>
        </div>
        <a routerLink="/carte" class="btn btn-ghost">Voir la carte →</a>
      </div>
      <div class="zone-grid mt-24">
        <div class="zone-card card" *ngFor="let z of zones">
          <div class="flex between center">
            <h4>{{ z.nom }}</h4>
            <span class="badge" [class.badge-success]="z.placesLibres > 10" [class.badge-danger]="z.placesLibres <= 10">
              {{ z.placesLibres }} libres
            </span>
          </div>
          <p class="text-muted zdesc">{{ z.description }}</p>
          <div class="flex between center mt-16">
            <span class="ztarif">{{ z.tarifHoraire }} FCFA/h</span>
            <a [routerLink]="['/reservation', z.id]" class="zlink">Réserver →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA PAIEMENT -->
    <section class="pay">
      <div class="container pay-grid">
        <div>
          <h2>Paiement mobile intégré</h2>
          <p>Vos recettes de stationnement sont désormais tracées et sécurisées. Chaque transaction est
             enregistrée et reversée automatiquement à la Ville de Dakar.</p>
          <div class="pay-logos">
            <span class="paylogo wave">Wave</span>
            <span class="paylogo om">Orange Money</span>
            <span class="paylogo free">Free Money</span>
          </div>
        </div>
        <div class="pay-stat">
          <div class="ps-big">100 %</div>
          <div class="ps-label">des transactions tracées</div>
        </div>
      </div>
    </section>

    <footer class="foot">
      <div class="container flex between center">
        <span>© 2026 DakarPark — Ville de Dakar</span>
        <span class="text-muted">Mémoire de licence — Khadim Diakhaté</span>
      </div>
    </footer>
  `,
  styles: [`
    h2 { font-size: 26px; font-weight: 700; color: var(--ink); }
    .sub { margin-top: 5px; margin-bottom: 24px; text-align: center; }
    /* HERO */
    .hero { background: linear-gradient(160deg, #eef7f8 0%, #f4f8f9 60%); padding: 40px 0 44px; }
    .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 40px; align-items: center; }
    .pill { display: inline-block; background: #fff; border: 1px solid var(--line); color: var(--primary-dark); font-weight: 600; font-size: 13px; padding: 7px 14px; border-radius: 999px; box-shadow: var(--shadow); }
    .hero-text h1 { font-size: 36px; line-height: 1.12; font-weight: 800; margin: 16px 0 12px; letter-spacing: -0.5px; }
    .hero-text p { font-size: 16px; color: var(--muted); line-height: 1.55; max-width: 520px; }
    .trust { display: flex; gap: 34px; }
    .trust b { font-size: 24px; color: var(--primary-dark); display: block; }
    .trust span { font-size: 13px; color: var(--muted); }
    .mt-32 { margin-top: 22px !important; }
    /* HERO CARD */
    .hero-card { position: relative; }
    .map-mini { position: relative; height: 250px; border-radius: 20px; background:
      linear-gradient(0deg, rgba(14,107,117,.06), rgba(14,107,117,.06)),
      repeating-linear-gradient(0deg, #dfeced 0 1px, transparent 1px 40px),
      repeating-linear-gradient(90deg, #dfeced 0 1px, transparent 1px 40px), #eef6f7;
      border: 1px solid var(--line); box-shadow: var(--shadow-lg); overflow: hidden; }
    .pin { position: absolute; font-size: 24px; filter: drop-shadow(0 4px 6px rgba(0,0,0,.15)); }
    .pin-1 { top: 34px; left: 60px; } .pin-2 { top: 78px; left: 200px; }
    .pin-3 { top: 150px; left: 110px; } .pin-4 { top: 180px; left: 250px; }
    .car { position: absolute; bottom: 20px; left: 30px; font-size: 28px; }
    .route { position: absolute; top: 48px; left: 78px; width: 130px; height: 110px; border-left: 3px dashed var(--primary-light); border-bottom: 3px dashed var(--primary-light); border-radius: 0 0 0 12px; opacity: .6; }
    .mini-card { background: #fff; border-radius: 14px; box-shadow: var(--shadow-lg); padding: 16px; margin: -36px 20px 0; position: relative; border: 1px solid var(--line); }
    .mc-title { font-weight: 700; font-size: 15px; }
    .mc-sub { font-size: 12.5px; color: var(--muted); margin-top: 3px; }
    .price { font-size: 20px; font-weight: 800; color: var(--primary-dark); }
    .price small { font-size: 12.5px; color: var(--muted); font-weight: 500; }
    /* FEATURES */
    .features { padding: 44px 0 12px; text-align: center; }
    .feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .feat { padding: 24px 22px; text-align: left; }
    .feat-ico { width: 50px; height: 50px; border-radius: 13px; display: grid; place-items: center; font-size: 24px; margin-bottom: 14px; }
    .feat h3 { font-size: 18px; margin-bottom: 6px; }
    .feat p { color: var(--muted); font-size: 14px; line-height: 1.5; }
    /* ZONES */
    .zones { padding: 40px 0; }
    .zone-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
    .zone-card { padding: 20px; }
    .zone-card h4 { font-size: 15.5px; font-weight: 700; max-width: 70%; }
    .zdesc { font-size: 13px; margin-top: 5px; }
    .ztarif { font-weight: 700; color: var(--primary-dark); }
    .zlink { color: var(--primary); font-weight: 600; font-size: 14px; }
    /* PAY */
    .pay { background: linear-gradient(135deg, var(--primary-dark), var(--primary)); color: #fff; padding: 44px 0; margin-top: 12px; }
    .pay-grid { display: grid; grid-template-columns: 1.4fr 0.6fr; gap: 36px; align-items: center; }
    .pay h2 { color: #fff; }
    .pay p { color: rgba(255,255,255,.85); font-size: 15.5px; line-height: 1.55; margin-top: 10px; max-width: 560px; }
    .pay-logos { display: flex; gap: 12px; margin-top: 20px; }
    .paylogo { padding: 9px 16px; border-radius: 10px; font-weight: 700; font-size: 14.5px; }
    .paylogo.wave { background: #1dc4ff; color: #003; }
    .paylogo.om { background: #ff7900; color: #fff; }
    .paylogo.free { background: #cddc39; color: #1a2400; }
    .pay-stat { text-align: center; background: rgba(255,255,255,.1); border-radius: 18px; padding: 24px; }
    .ps-big { font-size: 42px; font-weight: 800; }
    .ps-label { font-size: 13.5px; color: rgba(255,255,255,.85); }
    /* FOOT */
    .foot { padding: 22px 0; border-top: 1px solid var(--line); font-size: 13.5px; color: var(--muted); }
    @media (max-width: 900px) {
      .hero-grid, .feat-grid, .zone-grid, .pay-grid { grid-template-columns: 1fr; }
      .hero-text h1 { font-size: 30px; }
    }
  `],
})
export class AccueilComponent {
  private data = inject(DataService);
  zones = this.data.getZones();
  stats = this.data.getStats();
}
