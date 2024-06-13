import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { LeadboardComponent } from './leadboard/leadboard.component';
import { CompletedLeadsComponent } from './completed-leads/completed-leads.component';

export const routes: Routes = [
    { path: 'user/:id', component: UserDetailComponent },
    { path: 'product/:id', component: ProductDetailComponent },
    { path: 'user', component: UserComponent },
    { path: 'product', component: ProductComponent },
    { path: 'completed-leads', component: CompletedLeadsComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '', component: LeadboardComponent }
];
