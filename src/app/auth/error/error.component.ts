import { Component, Inject } from "@angular/core";
import { inject } from "@angular/core/testing";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  templateUrl: "./error.component.html"
})
export class ErrorComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
