import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingService } from '../shopping.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css'
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm: NgForm;
  sub: Subscription;
  editMode = false;
  editItemIndex: number;
  editItem: Ingredient;
  
  constructor(private shoppingService: ShoppingService) {}

  ngOnInit(): void {
    this.sub = this.shoppingService.startEdit.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editItemIndex = index;
        this.editItem = this.shoppingService.getItem(index);
        this.editForm.setValue({
          name: this.editItem.name,
          amount: this.editItem.amount
        })
      }
    );
  }

  onSubmit(form: NgForm) {
    const ing = new Ingredient(form.value.name, form.value.amount);
    if (this.editMode) {
      this.shoppingService.updateItem(this.editItemIndex, ing);
    } else {
      this.shoppingService.addItem(ing);
    }

    this.editMode = false;
    form.reset();
  }

  onDelete(form: NgForm) {
    this.shoppingService.deleteItem(this.editItemIndex);

    this.editMode = false;
    form.reset();
  }

  onClear(form: NgForm) {
    this.editMode = false;
    form.reset();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
