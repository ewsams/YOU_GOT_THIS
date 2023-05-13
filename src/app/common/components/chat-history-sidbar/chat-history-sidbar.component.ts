import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FileService } from '../../services/file.service'
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors'
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-chat-history-sidbar',
  templateUrl: './chat-history-sidbar.component.html',
  styleUrls: ['./chat-history-sidbar.component.scss'],
})
export class ChatHistorySidbarComponent implements OnInit {
  @Input() userId: string | undefined
  @Input() mediaType: 'pdf' | 'audio' | undefined
  @Output() qaHistorySelected = new EventEmitter<any>()
  public isDarkTheme$ = this._store.select(selectIsDarkTheme)

  public qaHistories: any[] = []

  constructor(private _fileService: FileService, private _store: Store) {}

  ngOnInit(): void {
    this.fetchQaHistories()
  }

  fetchQaHistories(): void {
    if (this.userId) {
      this._fileService.getQaHistoriesByUserIdAndType(this.userId, this.mediaType).subscribe((qaHistories) => {
        this.qaHistories = qaHistories.sort(
          (a, b) => (b.created_at as unknown as number) - (a.created_at as unknown as number),
        )
      })
    }
  }

  selectQaHistory(qaHistory: any): void {
    this.qaHistorySelected.emit(qaHistory)
  }

  updateTitle(qaHistory: any, newTitle: string): void {
    qaHistory.title = newTitle
    this._fileService.updateQaHistory(qaHistory._id, qaHistory).subscribe()
  }
}
