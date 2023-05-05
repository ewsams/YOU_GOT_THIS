import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors'
import { SubResolver } from '../../helpers/sub-resolver'
import { takeUntil } from 'rxjs'
import { FileService } from '../../services/file.service'

@Component({
  selector: 'app-pdf-chat',
  templateUrl: './pdf-chat.component.html',
  styleUrls: ['./pdf-chat.component.scss'],
})
export class PdfChatComponent extends SubResolver {
  public isDarkTheme$ = this._store.select(selectIsDarkTheme)
  public qaHistory: { query: string; answer: string }[] = []
  public query = ''
  public answer = ''
  public isLoadingAnswer = false
  public pdfLoading = false
  public pdfUploaded = false

  constructor(private _fileService: FileService, private _store: Store) {
    super()
  }

  public onUploadPdf(event: any) {
    this.pdfLoading = true
    const pdfFile = event.target.files[0]
    this._fileService
      .embedAndUploadPdf(pdfFile)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.message === 'PDF embedded and uploaded successfully.') {
          this.pdfLoading = false
          this.pdfUploaded = true
        }
      })
  }

  public onSubmitQuery() {
    this.isLoadingAnswer = true
    this._fileService
      .queryEmbeddedPdf(this.query)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.answer = res.answer
        this.qaHistory.push({ query: this.query, answer: res.answer })
        this.query = ''
        this.isLoadingAnswer = false
      })
  }

  public resetComponent() {
    this.query = ''
    this.answer = ''
    this.qaHistory = []
    this.pdfLoading = false
    this.pdfUploaded = false
  }
}
