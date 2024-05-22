import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { ProductComponent } from './product/product.component';

export const routes: Routes = [
    { path: 'user/:id', component: UserDetailComponent },
    { path: 'user', component: UserComponent },
    { path: 'product', component: ProductComponent },
    { path: '', component: DashboardComponent }
];
