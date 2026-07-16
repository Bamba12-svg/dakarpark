import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil.component';
import { ConnexionComponent } from './pages/connexion.component';
import { InscriptionComponent } from './pages/inscription.component';
import { CarteComponent } from './pages/carte.component';
import { ReservationComponent } from './pages/reservation.component';
import { DashboardAgentComponent } from './pages/dashboard-agent.component';
import { MesReservationsComponent } from './pages/mes-reservations.component';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'carte', component: CarteComponent },
  { path: 'reservation/:zoneId', component: ReservationComponent },
  { path: 'mes-reservations', component: MesReservationsComponent },
  { path: 'agent', component: DashboardAgentComponent },
  { path: '**', redirectTo: '' },
];
