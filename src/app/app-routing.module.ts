import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './Guards/auth.guard';
import { ChatPageComponent } from './Pages/chat-page/chat-page.component';
import { HomePageComponent } from './Pages/home-page/home-page.component';

const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'chat', component: ChatPageComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
