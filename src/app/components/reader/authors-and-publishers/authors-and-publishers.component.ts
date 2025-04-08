import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Category, User } from '../../../modals/shared.modal';
import { ModalService } from '../../../services/modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../shared/loader/loader.component';

@Component({
  selector: 'app-authors-and-publishers',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NzSelectModule, LoaderComponent],
  templateUrl: './authors-and-publishers.component.html',
  styleUrl: './authors-and-publishers.component.css'
})
export class AuthorsAndPublishersComponent {
  authors: User[] = [];
  selectedCategories: any[] = [];
  userInfo: User | null = null
  searchQuery: string = '';
  categories: Category[] = [];
  loading: boolean = false
  constructor(private router: Router, private service: SharedService, private modalService: ModalService, private toastr: NzMessageService) { }


  ngOnInit(): void {
    this.loading = true
    this.getAuthors();
    this.getCategory();
    const data = localStorage.getItem('userInfo');
    if (data) {
      this.userInfo = JSON.parse(data);
    }
  }

  getAuthors() {

    let apiUrl = ''
    if (this.service.isLogedIn('user')) {
      apiUrl = `users/getAllAuthor?search=${this.searchQuery.trim()}&categories=${this.selectedCategories.join(',')}`
    } else {
      apiUrl = `users/getAllAnonymousAuthor?search=${this.searchQuery.trim()}&categories=${this.selectedCategories.join(',')}`
    }

    this.service.get(apiUrl).subscribe({
      next: (resp: any) => {
        this.authors = resp.authors;
        this.loading = false
        // this.authors = resp.authors.filter((author: any) => author.books.length > 0);
      },
      error: error => {
        this.loading = false
        console.log(error.message);
      }
    });
  }
  getCategory() {
    let apiUrl = ''
    if (this.service.isLogedIn('user')) {
      apiUrl = 'users/getAllCategories'
    } else {
      apiUrl = 'users/getAllAnonymousCategories'
    }

    this.service.get(apiUrl).subscribe({
      next: (resp: any) => {
        this.categories = resp.categories;
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  followAuthor(authoeId: Number) {

    if (this.service.isLogedIn('user')) {
      this.loading = true
      this.service.postAPI(`users/follow/${authoeId}`, {}).subscribe({
        next: (resp: any) => {
          this.getAuthors();
          this.toastr.success(resp.message);
          this.loading = false
        },
        error: error => {
          this.toastr.error(error);
          this.loading = false
        }
      });
    } else {
      this.modalService.openModal();
    }
  }

  unfollowAuthor(authoeId: Number) {
    this.loading = true
    this.service.postAPI(`users/unfollow/${authoeId}`, {}).subscribe({
      next: (resp: any) => {
        this.getAuthors();
        this.toastr.success(resp.message);
        this.loading = true
      },
      error: error => {
        this.toastr.error(error);
        this.loading = true
      }
    });
  }

  sendMessage(item: any) {
    if (this.service.isLogedIn('user')) {
      this.router.navigate(['/chat'], { queryParams: { author: item.id } });
    } else {
      this.modalService.openModal();
    }
  }
  isFollowing(item: any) {
    return item.following?.some((_e: any) => _e.followerId === this.userInfo?.id);
  }
}
