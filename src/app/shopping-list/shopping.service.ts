import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";

@Injectable({providedIn: 'root'})
export class ShoppingService {
  ingChanged = new Subject<Ingredient[]>();
  startEdit = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Chicken', 1),
    new Ingredient('Spinache', 3)
  ];

  getList() {
    return this.ingredients.slice();
  }

  getItem(index: number) {
    return this.ingredients[index];
  }

  addItem(ing: Ingredient) {
    this.ingredients.push(ing);
    this.ingChanged.next(this.ingredients.slice());
  }

  addItems(ings: Ingredient[]) {
    this.ingredients.push(...ings);
    console.log(this.ingredients);
    this.ingChanged.next(this.ingredients.slice());
  }

  updateItem(index: number, ing: Ingredient) {
    this.ingredients[index] = ing;
    this.ingChanged.next(this.ingredients.slice());
  }

  deleteItem(index: number) {
    this.ingredients.splice(index, 1);
    this.ingChanged.next(this.ingredients.slice())
  }
}
