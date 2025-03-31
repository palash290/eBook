import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FollowedAuthor } from '../../../modals/followedAuthor.modal';
import { ModalService } from '../../../services/modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-followed-authors',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './followed-authors.component.html',
  styleUrl: './followed-authors.component.css'
})
export class FollowedAuthorsComponent {
  authors: FollowedAuthor[] = [];

  constructor(private router: Router, private service: SharedService, private modalService: ModalService, private toastr: NzMessageService) { }


  ngOnInit(): void {
    this.getAuthors();
  }

  getAuthors() {
    let apiUrl = 'users/followedAuthor'
    this.service.get(apiUrl).subscribe({
      next: (resp: any) => {
        this.authors = resp.followedAuthor;
      },
      error: error => {
        console.log(error.message);
      }
    });
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
}
