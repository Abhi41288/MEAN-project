import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPost = 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  userIsAuthenticated: boolean;
  userId: string;
  private postSubs = new Subscription();
  private authStatusSubs: Subscription;

  constructor(
    private postService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSubs = this.postService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postsCount: number }) => {
        this.isLoading = false;
        this.totalPost = postData.postsCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }
  onDelete(id: string) {
    this.postService.deletePost(id).subscribe(
      () => {
        this.postService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.postSubs.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }
}
