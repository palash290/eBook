import { Component } from '@angular/core';
import { User } from '../../../modals/shared.modal';
import { SharedService } from '../../../services/shared.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ModalService } from '../../../services/modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './author-detail.component.html',
  styleUrl: './author-detail.component.css'
})
export class AuthorDetailComponent {
  authors!: User
  authorId: number | undefined;
  userInfo: any;
  categoryNames: string = ''
  constructor(private router: Router, private service: SharedService, private modalService: ModalService, private toastr: NzMessageService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.authorId = params['author']
    })
  }

  ngOnInit(): void {
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
      this.service.postAPI(`users/follow/${authoeId}`, {}).subscribe({
        next: (resp: any) => {
          this.getAuthors();
          this.toastr.success(resp.message);
        },
        error: error => {
          this.toastr.error(error);
        }
      });
    } else {
      this.modalService.openModal();
    }
  }

  unfollowAuthor(authoeId: Number) {
    this.service.postAPI(`users/unfollow/${authoeId}`, {}).subscribe({
      next: (resp: any) => {
        this.getAuthors();
        this.toastr.success(resp.message);
      },
      error: error => {
        this.toastr.error(error);
      }
    });
  }

  isFollowing(item: any) {
    return item.following?.some((_e: any) => _e.followerId === this.userInfo?.id);
  }
}
