import { Component } from '@angular/core';
import { User } from '../../../modals/shared.modal';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ModalService } from '../../../services/modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../shared/loader/loader.component";

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
  templateUrl: './author-detail.component.html',
  styleUrl: './author-detail.component.css'
})
export class AuthorDetailComponent {
  authors!: User
  authorId: number | undefined;
  userInfo: any;
  loading: boolean = false
  categoryNames: string = ''
  constructor(private router: Router, private service: SharedService, private modalService: ModalService, private toastr: NzMessageService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.authorId = params['author']
    })
  }

  ngOnInit(): void {
    this.loading = true
    this.getProfile()
    if (this.authorId) {
      this.getAuthors()
    }
  }

  getAuthors() {

    let apiUrl = ''
    if (this.service.isLogedIn('user')) {
      apiUrl = `users/getAllAuthor/${this.authorId}`
    } else {
      apiUrl = `users/getAllAnonymousAuthor/${this.authorId}`
    }

    this.service.get(apiUrl).subscribe({
      next: (resp: any) => {
        this.authors = resp.author;
        this.loading = false
        if (this.authors?.AuthorCategory) {
          this.categoryNames = this.authors.AuthorCategory
            .map((c: any) => c.category?.name)
            .filter(name => name)
            .join(' | ');

        } else {
          this.categoryNames = 'No Categories';
        }
      },
      error: error => {
        console.log(error.message);
        this.loading = false
      }
    });
  }

  getProfile() {
    this.service.profileData$.subscribe((data) => {
      if (data) {
        this.userInfo = data;
      }
    })
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
