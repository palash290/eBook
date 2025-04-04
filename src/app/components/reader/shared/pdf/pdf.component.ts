import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-pdf',
  standalone: true,
  imports: [PdfViewerModule, CommonModule, FormsModule, LoaderComponent],
  templateUrl: './pdf.component.html',
  styleUrl: './pdf.component.css'
})
export class PdfComponent {

  pdfUrl!: SafeResourceUrl;
  title: string = '';
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.pdfUrl = params['url'];
      this.title = params['title'];
    })
  }

  ngOnInit(): void {
  }

  page: number = 1;
  totalPages: number = 0;
  isLoaded: boolean = false;
  zoom = 1.0;
  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  zoomIn() {
    this.zoom += 0.1;
  }

  zoomOut() {
    if (this.zoom > 0.2) {
      this.zoom -= 0.1;
    }
  }
}
