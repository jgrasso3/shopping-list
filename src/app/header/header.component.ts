import { Component, OnDestroy, OnInit } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isAuthed = false;
  private userSub: Subscription;

  constructor(private dsService: DataStorageService, private authServ: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authServ.user.subscribe(user => {
      // !! is intentional. !user is true if user is null, !!user is true if user is real and returns a true
      this.isAuthed = !!user;
    });
  }

  onSaveData() {
    this.dsService.storeRecipes();
  }

  onGetData() {
    this.dsService.getRecipes().subscribe();
  }

  onLogout() {
    this.authServ.logout();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
