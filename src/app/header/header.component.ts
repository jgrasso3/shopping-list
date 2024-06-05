import { Component } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  collapsed = true;

  constructor(private dsService: DataStorageService) {}

  onSaveData() {
    this.dsService.storeRecipes();
  }

  onGetData() {
    this.dsService.getRecipes().subscribe();
  }
}
