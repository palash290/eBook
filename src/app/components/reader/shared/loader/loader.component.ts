import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  schemas: [NO_ERRORS_SCHEMA], // Allow unknown elements
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {

}
