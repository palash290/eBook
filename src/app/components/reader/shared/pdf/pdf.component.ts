import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf',
  standalone: true,
  imports: [],
  templateUrl: './pdf.component.html',
  styleUrl: './pdf.component.css'
})
export class PdfComponent {

  // constructor(private sanitizer: DomSanitizer) { }

  // // ngOnInit(): void {
  // //   setTimeout(() => {
  // //     window.location.reload();
  // //   }, 1000);
  // // }

  // sanitizeUrl(url: any): SafeUrl {

  //   return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  // }

  pdfUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/sample.pdf');
  }

}
