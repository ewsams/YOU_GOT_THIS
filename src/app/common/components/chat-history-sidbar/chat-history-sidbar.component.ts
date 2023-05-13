import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FileService } from '../../services/file.service'
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors'
import { Store } from '@ngrx/store'
import { UserQaHistoriesResponse } from '../../models/user-qa-histories.model'

@Component({
  selector: 'app-chat-history-sidbar',
  templateUrl: './chat-history-sidbar.component.html',
  styleUrls: ['./chat-history-sidbar.component.scss'],
})
export class ChatHistorySidbarComponent implements OnInit {
  @Input() userId: string | undefined
  @Input() mediaType!: 'pdf' | 'audio'
  @Output() qaHistorySelected = new EventEmitter<any>()
  @Output() pageChanged = new EventEmitter<number>()
  public isDarkTheme$ = this._store.select(selectIsDarkTheme)
  public isMobileMenuHidden = true
  public isMobile = false

  public qaHistoriesArray: any[] = []
  public totalPages: number | undefined
  public currentPage = 1
  public limit = 5

  constructor(private _fileService: FileService, private _store: Store) {}

  ngOnInit(): void {
    this.loadQaHistories()
    this.isMobile = window.innerWidth < 1024
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 1024
    })
  }

  public fetchQaHistories(): void {
    if (this.userId) {
      const currentPage = 1
      const limit = 5
      this._fileService.getQaHistoriesByUserIdAndType(this.userId, this.mediaType).subscribe((res) => {
        this.qaHistoriesArray = res.qaHistories
        this.totalPages = res.totalPages
        this.currentPage = res.currentPage
      })
    }
  }

  public selectQaHistory(qaHistory: any): void {
    this.qaHistorySelected.emit(qaHistory)
  }

  public updateTitle(qaHistory: any, newTitle: string): void {
    qaHistory.title = newTitle
    this._fileService.updateQaHistory(qaHistory._id, qaHistory).subscribe()
  }

  public toggleMobileMenu(): void {
    this.isMobileMenuHidden = !this.isMobileMenuHidden
  }

  public changePage(newPage: number) {
    this.currentPage = newPage
    this.loadQaHistories()
  }

  public loadQaHistories() {
    this._fileService
      .getQaHistoriesByUserIdAndType(this.userId as string, this.mediaType, this.currentPage, this.limit)
      .subscribe((response: UserQaHistoriesResponse) => {
        this.qaHistoriesArray = response.qaHistories
        this.totalPages = response.totalPages
        this.currentPage = response.currentPage
      })
  }
}
