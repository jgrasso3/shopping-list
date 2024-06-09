import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: 'appFoo'
})
export class FooDirective {
  constructor(public viewConRef: ViewContainerRef) {}
}
