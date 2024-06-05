import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css'
})
export class RecipeEditComponent implements OnInit{
  manageRecipe: FormGroup
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private recipeService: RecipeService, 
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  onSubmit() {
    // recipeForm.value matches this structure already
    // const recipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']
    // );

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.router.navigate(['..'], { relativeTo: this.route });
    } else {
      const index = this.recipeService.addRecipe(this.recipeForm.value);
      this.router.navigate(['..', index], { relativeTo: this.route });
    }

    // Could just call this, but I want to navigate to the newly created recipe instead
    // this.onCancel();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required, 
          Validators.pattern(/^[0-9][0-9]*$/)])
      })
    )
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  private initForm() {
    let recipeName = '';
    let recipeIP = '';
    let recipeDesc = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeIP = recipe.imagePath;
      recipeDesc = recipe.description;
      if (recipe['ingredients']) {
        for (let ing of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ing.name, Validators.required),
              amount: new FormControl(ing.amount, [
                Validators.required, 
                Validators.pattern(/^[0-9][0-9]*$/)])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeIP, Validators.required),
      description: new FormControl(recipeDesc, Validators.required),
      ingredients: recipeIngredients
    });
  }

  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onCancel() {
    // if (isNaN(+this.id)) {
    //   this.router.navigate(['/recipes']);
    // } else {
    //   this.router.navigate(['/recipes', this.id]);
    // }
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
