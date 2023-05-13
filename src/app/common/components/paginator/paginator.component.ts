import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors'

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
  @Input() currentPage: number | undefined
  @Input() totalPages: number | undefined
  @Output() pageChanged = new EventEmitter<number>()
  private _store = inject(Store)
  public isDarkTheme$ = this._store.select(selectIsDarkTheme)

  changePage(newPage: number) {
    if (this.totalPages) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.pageChanged.emit(newPage)
      }
    }
  }
}
