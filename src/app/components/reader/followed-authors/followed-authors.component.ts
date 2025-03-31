import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FollowedAuthor } from '../../../modals/followedAuthor.modal';
import { ModalService } from '../../../services/modal.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoaderComponent } from "../shared/loader/loader.component";

@Component({
  selector: 'app-followed-authors',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
  templateUrl: './followed-authors.component.html',
  styleUrl: './followed-authors.component.css'
})
export class FollowedAuthorsComponent {
  authors: FollowedAuthor[] = [];
  loading: boolean = false
  constructor(private router: Router, private service: SharedService, private modalService: ModalService, private toastr: NzMessageService) { }


  ngOnInit(): void {
    this.getAuthors();
  }

  getAuthors() {
    this.loading = true
    let apiUrl = 'users/followedAuthor'
    this.service.get(apiUrl).subscribe({
      next: (resp: any) => {
        this.authors = resp.followedAuthor;
        this.loading = false
      },
      error: error => {
        console.log(error.message);
        this.loading = false
      }
    });
  }

  unfollowAuthor(authoeId: Number) {
    this.loading = true
    this.service.postAPI(`users/unfollow/${authoeId}`, {}).subscribe({
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
  }
}
