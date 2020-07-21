import { Component, EventEmitter, Output } from "@angular/core";
import { Post } from "../post.model";
import { NgForm } from "@angular/forms";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent {
  enteredTitle = "";
  enteredContent = "";

  constructor(private postsService: PostsService) {}

  onAddPost(postForm: NgForm) {
    this.postsService.addPost(postForm.value.title, postForm.value.content);
    postForm.resetForm();
  }
}
