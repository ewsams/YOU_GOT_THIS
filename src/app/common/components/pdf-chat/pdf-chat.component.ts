import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors'
import { SubResolver } from '../../helpers/sub-resolver'
import { catchError, of, switchMap, takeUntil, tap } from 'rxjs'
import { FileService } from '../../services/file.service'
import { selectUserId } from 'src/app/store/auth/auth.selectors'

@Component({
  selector: 'app-pdf-chat',
  templateUrl: './pdf-chat.component.html',
  styleUrls: ['./pdf-chat.component.scss'],
})
export class PdfChatComponent extends SubResolver implements OnInit {
  public isDarkTheme$ = this._store.select(selectIsDarkTheme)
  public userId$ = this._store.select(selectUserId)
  public qaHistory: { query: string; answer: string }[] = []
  public query = ''
  public answer = ''
  public isLoadingAnswer = false
  public pdfLoading = false
  public pdfUploaded = false
  public embeddings: string | undefined
  public embeddingsUrl: string | undefined
  public userId: string | undefined
  private qaHistoryId: string | undefined
  public title = ''

  constructor(private _fileService: FileService, private _store: Store) {
    super()
  }

  ngOnInit(): void {
    this.getUserId()
  }

  public onUploadPdf(event: any) {
    this.pdfLoading = true
    const pdfFile = event.target.files[0]
    this._fileService
      .embedAndUploadPdf(pdfFile)
      .pipe(
        takeUntil(this.destroy$),
        tap((pdf) => {
          if (pdf.message === 'PDF uploaded, embedded and indexed successfully.') {
            this.pdfLoading = false
            this.pdfUploaded = true
            this.embeddings = pdf.embedded_pdf_summary
          }
        }),
        switchMap((pdf) => {
          if (pdf.message === 'PDF uploaded, embedded and indexed successfully.') {
            return this._fileService.createQaHistory({
              userId: this.userId as string,
              qa: [],
              embeddings: this.embeddings as string,
              mediaType: 'pdf',
              title: this.title as string,
            })
          } else {
            return of(undefined)
          }
        }),
        catchError((error) => {
          console.log(error)
          throw error
        }),
      )
      .subscribe((res) => (res ? (this.qaHistoryId = res._id) : null))
  }

  public onSubmitQuery() {
    this.isLoadingAnswer = true
    const url = 'https://you-got-this-ai-embeddings.s3.us-west-2.amazonaws.com/embeddings/'
    if (this.embeddingsUrl?.includes(url)) {
      this._fileService
        .queryPriorUploadedPdf(this.query, this.embeddingsUrl)
        .pipe(
          tap((res) => {
            this.answer = res.answer
            this.qaHistory.push({ query: this.query, answer: res.answer })
            this.query = ''
            this.isLoadingAnswer = false
          }),
        )
        .subscribe()
    } else {
      this._fileService
        .queryEmbeddedPdf(this.query)
        .pipe(
          takeUntil(this.destroy$),
          tap((res) => {
            this.answer = res.answer
            this.qaHistory.push({ query: this.query, answer: res.answer })
            this.query = ''
            this.isLoadingAnswer = false
          }),
          switchMap(() => {
            return this._fileService.updateQaHistory(this.qaHistoryId as string, {
              userId: this.userId as string,
              qa: this.qaHistory,
              embeddingsUrl: this.embeddingsUrl as string,
              mediaType: 'pdf',
              title: this.title as string,
            })
          }),
          catchError((error) => {
            console.log(error)
            throw error
          }),
        )
        .subscribe()
    }
  }

  public resetComponent() {
    this.query = ''
    this.answer = ''
    this.qaHistory = []
    this.pdfLoading = false
    this.pdfUploaded = false
  }

  public getUserId(): void {
    this.userId$.subscribe((userId) => {
      this.userId = userId as string
    })
  }

  public onQaHistorySelected(qaHistory: any): void {
    console.log(qaHistory)
    this.qaHistory = qaHistory.qa
    this.embeddingsUrl = qaHistory.embeddingsUrl
    this.title = qaHistory.title
    this.pdfUploaded = true
  }
}
