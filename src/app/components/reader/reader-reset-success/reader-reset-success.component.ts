import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-reader-reset-success',
  standalone: true,
  imports: [RouterLink, FooterComponent],
  templateUrl: './reader-reset-success.component.html',
  styleUrl: './reader-reset-success.component.css'
})
export class ReaderResetSuccessComponent {

}
