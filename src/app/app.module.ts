import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatPageComponent } from './Pages/chat-page/chat-page.component';
import { HomePageComponent } from './Pages/home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChatBoxComponent } from './Components/chat-box/chat-box.component';
import { MyChatComponent } from './Components/my-chat/my-chat.component';
import { TokenInterceptor } from './token.interceptor';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { SkeletonModule } from 'primeng/skeleton';
import { FileUploadModule } from 'primeng/fileupload';
import { GroupDetailsComponent } from './Components/group-details/group-details.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = { url: environment.baseUrl, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    ChatPageComponent,
    HomePageComponent,
    LoginComponent,
    SignupComponent,
    ChatBoxComponent,
    MyChatComponent,
    GroupDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    ButtonModule,
    ToastModule,
    MatProgressSpinnerModule,
    InputTextModule,
    DividerModule,
    DialogModule,
    MenuModule,
    FormsModule,
    SidebarModule,
    TabViewModule,
    TooltipModule,
    MultiSelectModule,
    SkeletonModule,
    FileUploadModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    DatePipe,
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
