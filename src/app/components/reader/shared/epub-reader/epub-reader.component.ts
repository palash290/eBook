import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import ePub from 'epubjs';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-epub-reader',
  standalone: true,
  imports: [],
  templateUrl: './epub-reader.component.html',
  styleUrl: './epub-reader.component.css'
})
export class EpubReaderComponent {
  @ViewChild('viewer', { static: true }) viewerRef!: ElementRef;
  book: any;
  rendition: any;
  currentFontSize: number = 100; // Default font size (percentage)

  pdfUrl: any;
  title: string = '';
  constructor(private route: ActivatedRoute, private toastr: NzMessageService) {
    this.route.queryParams.subscribe(params => {
      this.pdfUrl = params['url'];
      this.title = params['title'];
    })
  }
  ngAfterViewInit() {
    this.loadEpub();
  }

  loadEpub() {
    this.book = ePub(this.pdfUrl);
    this.rendition = this.book.renderTo(this.viewerRef.nativeElement, {
      width: '100%',
      height: '500px'
    });

    this.rendition.display();
  }

  nextPage() {
    this.rendition.next();
  }

  prevPage() {
    this.rendition.prev();
  }

  zoomIn() {
    this.currentFontSize += 10;
    this.rendition.themes.fontSize(`${this.currentFontSize}%`);
  }

  zoomOut() {
    this.currentFontSize -= 10;
    this.rendition.themes.fontSize(`${this.currentFontSize}%`);
  }

  playAudio() {
    const audioElements = this.viewerRef.nativeElement.querySelectorAll('audio');
    if (audioElements.length > 0) {
      audioElements[0].play();
    } else {
      this.toastr.warning('No audio found in the book.');
    }
  }
}
