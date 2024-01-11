import { Component, OnInit } from '@angular/core';
import { ShortcutsService } from 'src/app/services';

@Component({
  selector: 'app-shortcut',
  templateUrl: './shortcut.component.html',
  styleUrls: ['./shortcut.component.scss'],
})
export class ShortcutComponent implements OnInit {
  shortcuts: any[] = [];

  constructor(private shortcutsService: ShortcutsService) {}

  ngOnInit() {
    this.getShortcuts();
  }

  getShortcuts() {
    this.shortcutsService.getShortcuts().subscribe((res: any) => {
      if (res.data) this.shortcuts = res.data;
    });
  }
}
