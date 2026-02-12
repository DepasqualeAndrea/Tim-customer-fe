import { Routes, RouterModule } from '@angular/router';
import { RoutingGuard } from 'app/routing.guard';
import { LandingPageComponent } from 'app/components/public/landing-page/landingpage.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {path: 'landing-page', component: LandingPageComponent, canActivate: [RoutingGuard], data: {allowedTenants: ['chebanca_db', 'intesa_db', 'mediaworld-bs-it-it_db', 'fca-bank_db', 'ravenna_db', 'imola_db', 'lucca_db', 'tim-broker-employees_db', 'tim-broker-customers_db', 'imagin-es-es_db']}},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SharedRoutingModule {}
