import { Component } from '@angular/core';
import { AutherHeaderComponent } from '../auther-header/auther-header.component';
import { RouterOutlet } from '@angular/router';
import { AutherSidebarComponent } from '../auther-sidebar/auther-sidebar.component';

@Component({
  selector: 'app-auther-home',
  standalone: true,
  imports: [RouterOutlet, AutherHeaderComponent, AutherSidebarComponent],
  templateUrl: './auther-home.component.html',
  styleUrl: './auther-home.component.css'
})
export class AutherHomeComponent {

}
